# Virtual Keys
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

Create login link for [Home Assistant](https://www.home-assistant.io/) that you can share with guests.

![image](images/screenshot1.png)

## Description

Virtual Keys is a Home Assistant integration that allows you to create login links that can be shared with guests. These links provide access to specific entities in Home Assistant for a limited time.

See [Lovelace Virtual Keys](https://github.com/kcsoft/lovelace-virtual-keys) for a more detailed description.

## Installation with HACS

You need to install [HACS](https://hacs.xyz/) first.

1. In HACS, go to Integrations and click on the three dots in the top right corner. Select "Custom repositories".

2. Add `kcsoft/virtual-keys` as the repository and select the category `Integration`.

3. Search for "Virtual Keys" and download it.

4. Restart Home Assistant.

5. In Home Assistant, go to Settings -> Devices & Services -> Integrations and add "Virtual Keys". A new entry will appear in the sidebar.


## Use case

I want to share a "virtual key" with my friends that is valid for a limited time and that they can use to access specific entities in Home Assistant like the front gate. The key is actually a link to my Home Assistant that can be opened in a browser.

To make this work, I need to make some additional steps (after installing Virtual Keys):

1. Create a new user in Home Assistant, e.g., "guest".

2. Create a new group, e.g., "guests", and add the user "guest" to it, and also the devices you want to give access to, e.g., "cover.front_gate". Instructions [here](https://developers.home-assistant.io/blog/2019/03/11/user-permissions/).

3. Create a new View (tab) in the default Lovelace UI and add the entities you want to give access to, e.g., "cover.front_gate", set the visibility to only show to user "guest".

4. Install [kiosk-mode](https://github.com/NemesisRE/kiosk-mode) and configure it to set "kiosk" mode for user "guest".

That's it, you can now create Virtual Keys and share the link.
