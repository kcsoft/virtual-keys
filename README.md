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
