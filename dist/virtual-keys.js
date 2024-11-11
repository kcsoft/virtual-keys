import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

function humanSeconds(seconds) {
  return [
    [Math.floor(seconds / 31536000), "year"],
    [Math.floor((seconds % 31536000) / 86400), "day"],
    [Math.floor(((seconds % 31536000) % 86400) / 3600), "hour"],
    [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), "minute"],
    [(((seconds % 31536000) % 86400) % 3600) % 60, "second"],
  ]
    .map(([value, label]) => {
      return value > 0 ? `${value} ${label}${value !== 1 ? "s" : ""} ` : "";
    })
    .join(" ");
}

function differenceInMinutes(targetDateStr) {
  const now = new Date();
  const targetDate = new Date(targetDateStr);
  const diffInMilliseconds = targetDate - now;
  const diffInMinutes = Math.floor(diffInMilliseconds / 1000 / 60);
  return diffInMinutes;
}

class VirtualKeysPanel extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      route: { type: Object },
      panel: { type: Object },
      users: { type: Array },
      tokens: { type: Array },
      alert: { type: String },
    };
  }

  constructor() {
    super();
    this.users = [];
    this.tokens = [];
    this.user = null;
    this.dashboard = "dashboard-guest"; // Default dashboard
    this.alert = "";
    this.name = null;
    this.expire = 0;
    this.useDateTime = false;
    this.expirationDateTime = ""; // Store the date/time string
  }

  fetchUsers() {
    this.hass.callWS({ type: "virtual_keys/list_users" }).then((users) => {
      this.users = users
        .filter((user) => !user.system_generated && user.is_active)
        .map((user) => ({ id: user.id, name: user.name }));
      // Default to "guest" user or the first user in the list
      if (!this.user) {
        this.user =
          this.users.find((u) => u.name === "guest")?.id || this.users[0]?.id;
      }
    });
  }

  update(changedProperties) {
    if (changedProperties.has("hass") && this.hass) {
      this.fetchUsers();
    }
    super.update(changedProperties);
  }

  userChanged(e) {
    this.user = e.detail.value;
  }

  nameChanged(e) {
    this.name = e.target.value;
  }

  dashboardChanged(e) {
    this.dashboard = e.target.value;
  }

  expirationDateTimeChanged(e) {
    this.expirationDateTime = e.detail.value;
  }

  addClick() {
    const request = {
      type: "virtual_keys/create_token",
      name: this.name,
      user_id: this.user,
    };

    // Check if we're using date/time expiration or minutes
    if (this.useDateTime && this.expirationDateTime) {
      request.minutes = differenceInMinutes(this.expirationDateTime);
    } else {
      request.minutes = parseInt(this.expire, 10);
    }

    this.hass
      .callWS(request)
      .then(() => {
        this.fetchUsers();
      })
      .catch((err) => {
        this.alert = err.message;
        setTimeout(() => (this.alert = ""), 3000);
      });
  }

  getLoginUrl(token) {
    let url = `${this.hass.hassUrl()}local/community/virtual-keys/login.html?token=${
      token.jwt_token
    }`;
    if (this.dashboard) {
      url += `&dash=${this.dashboard}`;
    }
    return url;
  }

  listItemClick(e, token) {
    navigator.clipboard.writeText(this.getLoginUrl(token));
    this.alert = `Copied ${token.name} to clipboard!`;
    setTimeout(() => (this.alert = ""), 3000);
  }

  render() {
    return html`
      <div>
        <header class="mdc-top-app-bar mdc-top-app-bar--fixed">
          <div class="mdc-top-app-bar__row">
            <section
              class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start"
              id="navigation"
            >
              <div>
                <mwc-icon-button
                  title="Sidebar Toggle"
                  @click=${() =>
                    this.dispatchEvent(
                      new Event("hass-toggle-menu", {
                        bubbles: true,
                        composed: true,
                      })
                    )}
                >
                  <svg viewBox="0 0 24 24">
                    <g>
                      <path
                        class="primary-path"
                        d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"
                      ></path>
                    </g>
                  </svg>
                </mwc-icon-button>
              </div>
              <span class="mdc-top-app-bar__title">${this.panel.title}</span>
            </section>
          </div>
        </header>

        <div class="mdc-top-app-bar--fixed-adjust flex content">
          <div class="filters">
            <ha-textfield
              label="Key name"
              @input=${this.nameChanged}
            ></ha-textfield>

            <ha-combo-box
              .items=${this.users}
              .itemLabelPath="name"
              .itemValuePath="id"
              .value=${this.user}
              label="User"
              @value-changed=${this.userChanged}
            ></ha-combo-box>

            <ha-textfield
              label="Dashboard"
              .value=${this.dashboard}
              @input=${this.dashboardChanged}
            ></ha-textfield>

            <input
              type="checkbox"
              id="useDateTime"
              .checked=${this.useDateTime}
              @change=${(e) => (this.useDateTime = e.target.checked)}
            />
            <label for="useDateTime">Use Date/Time Expiration</label>

            ${this.useDateTime
              ? html`
                  <ha-selector
                    .selector=${{ datetime: { mode: "both" } }}
                    .hass=${this.hass}
                    label="Expiration Date/Time"
                    @value-changed=${this.expirationDateTimeChanged}
                  ></ha-selector>
                `
              : html`
                  <ha-textfield
                    label="Expire (minutes)"
                    type="number"
                    .value=${this.expire}
                    @input=${(e) => (this.expire = e.target.value)}
                  ></ha-textfield>
                `}

            <mwc-button raised label="Add" @click=${this.addClick}></mwc-button>
          </div>

          ${this.alert ? html`<ha-alert>${this.alert}</ha-alert>` : ""}
          ${this.tokens.length
            ? html`
                <ha-card class="container-list">
                  <mwc-list>
                    ${this.tokens.map(
                      (token) => html`
                        <mwc-list-item
                          hasMeta
                          twoline
                          @click=${(e) => this.listItemClick(e, token)}
                        >
                          <a href="${this.getLoginUrl(token)}">${token.name}</a>
                          <span slot="secondary"
                            >${token.user}, Expires:
                            ${humanSeconds(token.remaining)}</span
                          >
                          <mwc-icon
                            slot="meta"
                            @click=${(e) => this.deleteClick(e, token)}
                            >${this.deleteButton()}</mwc-icon
                          >
                        </mwc-list-item>
                      `
                    )}
                  </mwc-list>
                </ha-card>
              `
            : ""}
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      /* Add styles as per your design preference */
    `;
  }
}

customElements.define("virtual-keys-panel", VirtualKeysPanel);
