# Virtual Keys
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

Create login link for [Home Assistant](https://www.home-assistant.io/) that you can share with guests.

## Description

Virtual Keys is a Home Assistant integration that allows you to create login links that can be shared with guests. These links provide access to specific entities in Home Assistant for a limited time.

See [Lovelace Virtual Keys](https://github.com/kcsoft/lovelace-virtual-keys) for a more detailed description.

## Installation

Both [this integration](https://github.com/kcsoft/virtual-keys) and the [Lovelace plugin](https://github.com/kcsoft/lovelace-virtual-keys) need to be installed.

### HACS Installation

You need to install [HACS](https://hacs.xyz/) first.

1. Add "Custom repositories" to HACS, paste the URL of this repository and select "Integration" as category.

2. Go to HACS -> Integrations, Explore and Download Repositories, search for "virtual keys" and install it.

3. Add the following to `configuration.yaml`:

    ```yaml
    virtual_keys:
    ```

4. Install the [Lovelace Virtual Keys](https://github.com/kcsoft/lovelace-virtual-keys) plugin as a companion app.

5. Restart Home Assistant.
