# video-name-parser
Parse names of video files to identify quality (e.g. 1080p), season/episode, year, etc.

# Usage
```javascript
var parseVideo = require("video-name-parser");
parseVideo("south park s01e01.avi"); // { name: "south park", season: 1, episode: [1], type: "series", tag: [] }
parseVideo("south park s01e01e02.avi"); // { name: "south park", season: 1, episode: [1,2], type: "movie", tag: [] }
parseVideo("The.Wizard.of.Oz.1939.1080p.BrRip.x264.mp4"); // { name: "wizard of oz", year: 1939, type: "movie", tag: [ "hd", "1080p" ] }
parseVideo("something else.mp4"); // { name: "other" } // no year or season/ep found, assuming 'other'
```
