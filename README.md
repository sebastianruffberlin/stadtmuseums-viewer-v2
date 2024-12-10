## Bührle Viewer

Based on [VIKUS Viewer](https://github.com/cpietsch/vikus-viewer) is a web-based visualization system that arranges thousands of cultural artifacts on a dynamic canvas and supports the exploration of thematic and temporal patterns of large collections, while providing rapid access to high-resolution imagery.

## Dev
- You can use https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer for VSCode to develop locally and have a live preview.

## Data
- Source: https://github.com/kunsthaus/buehrle
- Massage: https://observablehq.com/@cpietsch/kunsthaus-buhrle-data-masseur


## Local Install
- install nginx `sudo apt install nginx`
- clone into `/var/www/html`
- move data.tar to data/local

### Services
```sh
sudo cp .linux/* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable scheduled-shutdown.timer
sudo systemctl enable kiosk
```

### history

```sh
 343  sudo systemctl list-timers
  344  sudo systemctl disable update-notifier-motd.service update-notifier-download.service
  345  sudo systemctl disable update-notifier-download.timer update-notifier-motd.timer
  349  systemctl status update-notifier-download.timer
  350  sudo systemctl stop update-notifier-download.timer
  351  sudo systemctl disable update-notifier-download.timer
  352  sudo systemctl disable update-notifier-download.service
  353  sudo systemctl mask update-notifier-download.service
```

## Screen
- https://iiyama.com/de_de/produkte/prolite-tf6539uhsc-b1ag/
