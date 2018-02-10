/*
 * Constants 
 * */
var maxSegments = 3;

var movieKeywords = ["1080p", "720p", "480p", "blurayrip", "brrip", "divx", "dvdrip", "hdrip", "hdtv", "tvrip", "xvid", "camrip"];

// Excluded is an object we use to exclude those keywords from consideration for detecting strings like "season X"
var excluded = { };
movieKeywords.forEach(function(x) { excluded[x] = 1 });

var SEGMENTS_SPLIT = /\.| |-|;|_/g;
var MATCH_FILES = /.mp4$|.mkv$|.avi$/;
var minYear = 1900, maxYear = 2030;

/*
 * TWO REFERENCES
 * * http://wiki.xbmc.org/index.php?title=Adding_videos_to_the_library/Naming_files/TV_shows
 * * http://wiki.xbmc.org/index.php?title=Advancedsettings.xml#.3Ctvshowmatching.3E
 */
 

function simplifyName(n) { 
    return n.toLowerCase()
        .trim()
        .replace(/\([^\(]+\)$/, "") // remove brackets at end
        .replace(/&/g, "and")
        .replace(/[^0-9a-z ]+/g, " ") // remove special chars
        .split(" ").filter(function(r){return r}).join(" ")
};

function parseVideoName(filePath, options)
{
    //if (! filePath.match(MATCH_FILES)) return { type: "other" };

    var options = options || {};
    var meta = {};
    
    var segments = filePath
        .replace(/\\/g, "/") // Support Windows slashes, lol
        .split("/")
        .reverse()
        .filter(function(x) { return x })
        .slice(0, maxSegments);
    var firstNameSplit = segments[0].split(/\.| |_/);
    
    /*
     * Helpers to validate if we have found the proper metadata
     */
    function saneSeason()
    {
        return meta.hasOwnProperty("season") && !isNaN(meta.season)
    };
    function saneEpisode()
    {
        return Array.isArray(meta.episode) && meta.episode.length
    };
    
    /* 
     * Test for a year in the name
     * */
    [segments[0], segments[1]].filter(function(x){return x}).forEach(function(seg)
    {
        var regex = /\b\d{4}\b/g
        var matches

        while (matches = regex.exec(seg)) 
        {
            var number = parseInt(matches[0], 10);
            if (number >= minYear && number <= maxYear)
                meta.year = number
        }
    });

    /* 
     * Test for "aired" stamp; if aired stamp is there, we have a series
     */ 
    var pad = function(x) { return ("00"+x).slice(-2) };
    [segments[0], segments[1]].filter(function(x){return x}).forEach(function(seg)
    {
        var aired = seg.match(/(\d\d\d\d)(\.|-| )(\d\d)(\.|-| )(\d\d)/);
        if (aired && aired[1]) 
        {
            var year = parseInt(aired[1], 10);
            if (year >= minYear && year <= maxYear)
                meta.aired = [year, pad(aired[3]), pad(aired[5])].join("-");
        }
    });    

    /* 
     * A typical pattern - "s05e12", "S01E01", etc. ; can be only "E01"
     * Those are matched only in the file name
     * 
     * TODO: this stamp may be in another segment (e.g. directory name)
    * */
    [segments[0], segments[1]].forEach(function(seg) { 
        if (seg) seg.split(/\.| |_/).forEach(function(x, i)
        {
            /*
             * Card type one
             */
            var seasonMatch = x.match(/S(\d{1,2})/i);   /* TODO: bug: uc-css4cd2.avi is a false positive */
            if (seasonMatch)
                meta.season = parseInt(seasonMatch[1], 10);
            
            /* TODO: consider the case when a hyphen is used for multiple episodes ; e.g. e1-3 */
            var episodeMatch = x.match(/E(\d{2})/ig);
            if (episodeMatch)
                meta.episode = episodeMatch.map(function(y) { return parseInt(y.slice(1), 10) });
            
            /* 
             * 01x20
             */
            var xStampMatch = x.match(/(\d\d?)x(\d\d?)/i);
            if (xStampMatch)
            {
                meta.season = parseInt(xStampMatch[1], 10);
                meta.episode = [ parseInt(xStampMatch[2], 10) ];
            }
            // if (otherCardMatch)
        });

        /* Extract name from this match */
        var fullMatch = seg && seg.replace(/\.| |;|_/g, " ").match(/^([a-zA-Z0-9,-?!'& ]*) S(\d{1,2})E(\d{2})/i);
        if (!meta.name && meta.season && meta.episode && fullMatch && fullMatch[1]) meta.name = fullMatch[1];
        // TODO: consider not going through simplifyName
    });

    /* 
     * This stamp must be tested before splitting (by dot) 
     * a pattern of the kind [4.02]
     * This pattern should be arround characters which are not digits and not letters 
     * */
     
    var dotStampMatch = segments[0].match(/[^\da-zA-Z](\d\d?)\.(\d\d?)[^\da-zA-Z]/i);
    if (! (saneSeason() && saneEpisode()) && dotStampMatch && !meta.year) // exclude meta.year to avoid confusing movie matches - especially if they contain 5.1 for suround sound
    {
        meta.season = parseInt(dotStampMatch[1], 10);
        meta.episode = [ parseInt(dotStampMatch[2], 10) ];
    }

    /*
     *  A stamp of the style "804", meaning season 8, episode 4
     * */
    if (!(saneSeason() && saneEpisode()) && !options.strict)
    {
        var stamp = firstNameSplit
        .reverse() /* search from the end */
        .map(function(x)
        {
            if (x.match(new RegExp("\\d\\d\\d\\d?e"))) x = x.slice(0, -1); /* This is a weird case, but I've seen it: dexter.801e.720p.x264-kyr.mkv */
            if (x.match(new RegExp("s\\d\\d\\d\\d?"))) x = x.slice(1); /* I've never seen this, but it might happen */
            return x;
        })
        .filter(function(x)
        {
            return !isNaN(x) && (x.length == 3 || (!meta.year && x.length == 4)) /* 4-digit only allowed if this has not been identified as a year */
        })[0]; /* Notice how always the first match is choosen ; the second might be a part of the episode name (e.g. "Southpark - 102 - weight gain 4000"); 
                * that presumes episode number/stamp comes before the name, which is where most human beings would put it */
    
        /* Since this one is risky, do it only if we haven't matched a year (most likely not a movie) or if year is BEFORE stamp, like: show.2014.801.mkv */
        if (stamp && (!meta.year || (meta.year && (firstNameSplit.indexOf(stamp.toString()) < firstNameSplit.indexOf(meta.year.toString())))))
        {
            meta.episode = [ parseInt(stamp.slice(-2), 10) ];
            meta.season = parseInt(stamp.slice(0, -2), 10);
        }
    }
    
    /* 
     * "season 1", "season.1", "season1" 
     * */
    if (! saneSeason())
    {
        var seasonMatch = segments.join("/").match(/season(\.| )?(\d{1,2})/ig); 
        if (seasonMatch)
            meta.season = parseInt(seasonMatch[0].match(/\d/g).join(""), 10);

        var seasonEpMatch = segments.join("/").match(/Season (\d{1,2}) - (\d{1,2})/i);
        if (seasonEpMatch) {
            meta.season = parseInt(seasonEpMatch[1], 10);
            meta.episode = [ parseInt(seasonEpMatch[2], 10) ];
        }
    }
    

    /* 
     * "episode 13", "episode.13", "episode13", "ep13", etc. 
     * */
    if (! saneEpisode())
    {
        /* TODO: consider the case when a hyphen is used for multiple episodes ; e.g. e1-3*/
        var episodeMatch = segments.join("/").match(/ep(isode)?(\.| )?(\d+)/ig);  
        if (episodeMatch)
            meta.episode = [ parseInt(episodeMatch[0].match(/\d/g).join(""), 10) ];
    }
    
    /*
     * Try plain number
     * This will lead to more false positives than true positives; disabling
     * /
     /*
    if (saneSeason() && !saneEpisode())
    {
        var epNumbers = firstNameSplit
            .filter(function(x) { return !isNaN(x) && (x.length == 2 || x.length == 1) })
            .map(function(x) { return parseInt(x, 10) })
            
        if (epNumbers.length)
            meta.episode = epNumbers;
    }*/
    
    /* 
     * If still nothing, the number from the second dir can be used, if the first dir has the show name??
     *  
     * OR, split everything by everything (hyphens, underscores), filter for numbers between 1 and 30 and use the assumption that the episode is on the rightmost and the series is left from it
     * (unless the numbers are a part of a date stamp)
     * */

    /*
     * Which part (for movies which are split into .cd1. and .cd2., etc.. files)
     * TODO: WARNING: this assumes it's in the filename segment
     * 
     * */
    var diskNumberMatch = segments[0].match(/[ _.-]*(?:cd|dvd|p(?:ar)?t|dis[ck]|d)[ _.-]*(\d)[^\d]/); /* weird regexp? */
    if (diskNumberMatch)
        meta.diskNumber = parseInt(diskNumberMatch[1], 10);
    
    /* 
     * The name of the series / movie
     * */
    var isSample;

    (options.fromInside ? segments : [].concat(segments).reverse()).forEach(function(seg, i)
    {
        if (seg == segments[0]) {
            seg = seg.split(".").slice(0, -1).join("."); /* Remove extension */

            var sourcePrefix = seg.match(/^\[(.*?)\]/)
            if (sourcePrefix) seg = seg.slice(sourcePrefix[0].length)
        }
        
        /*
         * WARNING: we must change how this works in order to handle cases like
         * "the office[1.01]" as well as "the office [1.01]"; if we split those at '[' or ']', we will get the name "the office 1 10" 
         * For now, here's a hack to fix this
         */
        var squareBracket = seg.indexOf("[");
        if (squareBracket > -1) seg = seg.slice(0, squareBracket);

        //var segSplit = seg.split(/\.| |-|\[|\]|;|_/),
        var segSplit = seg.split(SEGMENTS_SPLIT),
            word,
            nameParts = [];

        isSample = isSample || seg.match(/^sample/i)|| seg.match(/^etrg/i);
                
        /* No need to go further;  */
        if (meta.name)
            return;

        var lastIndex;
        segSplit.some(function(word, i)
        {
            lastIndex = i;
            /* words with basic punctuation and two-digit numbers; or numbers in the first position */
            if (! (word.match("^[a-zA-Z,?!'&]*$") || (!isNaN(word) && word.length <= 2) || (!isNaN(word) && i==0))
                || excluded[word.toLowerCase()] 
                || ((["ep", "episode", "season"].indexOf(word.toLowerCase()) > -1) && !isNaN(segSplit[i+1])) // TODO: more than that, match for stamp too
                )
                return true;

            nameParts.push(word);           
        });
        if (nameParts.length == 1 && !isNaN(nameParts[0])) return; /* Only a number: unacceptable */ 
    
        meta.name = nameParts
            .filter(function(x) { return x && x.length > 0 })
            .map(function(x) { return x[0].toUpperCase() + x.slice(1).toLowerCase() })
            .join(" ");
    });

    isSample = isSample || ((segments[1] || "").toLowerCase() == "sample"); /* The directory where the file resides */
    
    /* 
     * This is the time to decide the category of this video
     */
    var canBeMovie;
    if (options.strict) canBeMovie = meta.hasOwnProperty("year");
    else canBeMovie = meta.hasOwnProperty("year") || meta.hasOwnProperty("diskNumber") || movieKeywords.some(function(keyword) { return segments.join("/").toLowerCase().search(keyword) > -1 });

    if (meta.name && meta.aired)
        meta.type = "series";
    if (meta.name && saneSeason() && saneEpisode())
        meta.type = "series";
    else if (meta.name && canBeMovie)
        meta.type = "movie";
    // Must be deprioritized compared to movies
    else if (meta.type != "movie" && meta.name && saneSeason()) // assume extras or bloopers?
        meta.type = "extras";   
    else
        meta.type = "other";
    
    if (options.fileLength && options.fileLength < (meta.type.match(/movie/) ? 80 : 50)*1024*1024 && meta.type.match(/movie|series/) && !isSample) {
        meta.type = "other";
    }

    if (meta.type != "series" || meta.aired) {
        delete meta.episode;
        delete meta.season;
    }
    
    // we have a year. put it to .aired instead
    if (meta.type == "series" && meta.year) {
     meta.aired = meta.aired || meta.year;
     delete meta.year;
    }

    meta.type += isSample ? "-sample" : "";

    meta.name = meta.name && simplifyName(meta.name);
        
    /* Try to find the IMDB id from the NFO / hints
     */
    //if (meta.nfo)
    //    meta.imdb_id = (fs.readFileSync(meta.nfo).toString().match("tt\\d{7}") || [])[0];
    
    if (options.hints && options.hints.imdb_id)
        meta.imdb_id = options.hints.imdb_id;

    meta.tag = [];
    if (filePath.match(/1080p/i)) { meta.tag.push("hd"); meta.tag.push("1080p"); }
    if (filePath.match(/720p/i)) { meta.tag.push("720p"); }
    if (filePath.match(/480p/i)) { meta.tag.push("480p"); }
    if (isSample) meta.tag.push("sample");
     
    return meta;
}

module.exports = parseVideoName;
