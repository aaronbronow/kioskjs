kioskjs
=======

A kiosk presentation system built with Node and Angular.

####Issues

- ~~video lightbox not fit to screen height~~
- video ends, never restarts
- ~~gallery lightbox not fit to screen height~~
- gallery thumbnails not centered
- gallery thumbnails provide no indication that anything happened after click
- dragging lightbox "wiggles" the screen
- dragging arrows scrolls
- set timeout on gallery view
- ~~style gallery based on C's sketch~~
- ~~lightbox sometimes doesn't show up behind video~~
- ~~round corner of video (too complicated)~~
- ~~add transparency to lightbox on video~~
- need to swipe most of the screen width


####TODO

- left/right buttons as anchors on edges of screen
- swipe should be vertically centered
- swipe or touch should pause slideshow for 30 seconds
- wire up learn more
- replace timer with swipe config 
- build js app to handle screensaver defaults and scene interactions
- relative image paths

####Cases

- node loads layout and index page which shows kiosks and settings
- choosing kiosk starts screensaver
- angular renders index page by GET kiosks
- navigation to a kiosk GETs /#kiosk-name
- angular renders screensaver by kiosk-name
- app starts screensaver and listens for interactions