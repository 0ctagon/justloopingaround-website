# JustLoopingAround website

The repository contains the code for my [Marc Rebillet Livestream website](https://justloopingaround.com). The website consists of simple HTML and CSS files, and uses JavaScript to render the data. The website is available in French and English.

Files details:

- `css/robe.css` (like the beautiful robes worn each streams) contains the CSS styles.
- `js/looper.js` (like the RC-505 which manages everything) contains the main logic to render the streams data, the hall of fame, the jukebox and the song explorer.
- `js/pedal.js` (like the sustain pedal to add texture) handles the translation of some elements.
- `js/menu.js` manages the toggled menu.
- `js/stats.js` manages the stats figures display.
- `fr/` contains the French version of the website.

The database and the stats figures are created with Python scripts (see [here](https://github.com/0ctagon/justloopingaround-scripts)). The SVG files are from [svgrepo](https://www.svgrepo.com/).