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
- `sudo cp .linux/kiosk.service /etc/systemd/system/`
- `sudo systemctl enable kiosk`
- `/snap/bin/chromium --enable-features=UseOzonePlatform --ozone-platform=wayland --app="http://localhost/" --kiosk --noerrdialogs --disable-infobars --enable-features=OverlayScrollbar --disable-pinch`
