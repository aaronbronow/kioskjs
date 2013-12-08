kioskjs
=======

A kiosk presentation system built with Node and Angular.

####TODO

- left/right buttons as anchors on edges of screen
- swipe should be vertically centered
- swipe or touch should pause slideshow for 30 seconds
- wire up learn more 
- build js app to handle screensaver defaults and scene interactions

####Cases

- node loads layout and index page which shows kiosks and settings
- choosing kiosk starts screensaver
- angular renders index page by GET kiosks
- navigation to a kiosk GETs /#kiosk-name
- angular renders screensaver by kiosk-name
- app starts screensaver and listens for interactions