# virtual-keys
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

Create login link for [Home Assistant](https://www.home-assistant.io/) that you can share with guests.

![image](images/screenshot1.png)

# Installation

## HACS installation

You need to install [HACS](https://hacs.xyz/) first.

Because HACS doesn't support both `Integration` and `Plugin` in the same repository, you need to install it twice, once as an `Integration` and once as a `Plugin (Lovelace)`.

* add "Custom repositories" to HACS, paste the URL of this repository and select "Lovelace" as category

* go to HACS -> Frontend, Explore and Download Repositories, search for "virtual keys" and install it

* in HACS "Custom repositories" delete the URL of this repository

* add "Custom repositories" to HACS, paste the URL of this repository and this time select "Integration" as category

* go to HACS -> Integrations, Explore and Download Repositories, search for "virtual keys" and install it

* add to `configuration.yaml`:

```yaml
virtual_keys:

panel_custom:
  - name: virtual-keys-panel
    require_admin: true
    url_path: virtual-keys
    sidebar_title: Virtual Keys
    sidebar_icon: mdi:key-variant
    module_url: /local/community/virtual-keys/virtual-keys.js
```

* restart Home Assistant

# Use case

I want to share a "virtual key" with my friends that is valid for a limited time and that they can use to access specific entities in Home Assistant like the fron gate. The key is actually a link to my Home Assistant that can be opened in a browser.

To make this work, I need to make some additional steps (after installing Virtual Keys):

* create a new user in Home Assistant eg. "guest"

* create a new group eg. "guests" and add the user "guest" to it, and also the devices you want to give access to, eg "cover.front_gate", instructions [here](https://developers.home-assistant.io/blog/2019/03/11/user-permissions/)

* create a new dashboard in the default Lovelace UI and add the entities you want to give access to, eg. "cover.front_gate", set the visibility to only show to user "guest" – **recommended that you name the dashboard guest, as this is the default dashboard ID**

* install [kiosk-mode](https://github.com/NemesisRE/kiosk-mode) and configure it set "kiosk" mode for user "guest", by editing the raw dashboard, and adding this at the start of the file:
```yaml
kiosk_mode:
  user_settings:
    - users:
        - guest
      kiosk: true
```

Ths is it, you can now create Virtual Keys and share the link.
