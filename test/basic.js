var tape = require("tape");
var parser = require("../index");

console.log(parser("Blade.Runner.2049.2017.1080p.WEB-DL", { strict: true }))

var shows = [
    "pioneer.one.s01e01.avi",       //show with long-md
    "[ hoi ]pioneer.one.s01e01.avi",       //show with long-md with prefix
    //"pioneer.one.s1e1.avi",         //show with short-md //never seen; unsupported
    "pioneer.one.1x1.avi",          //show with alt-short-md
    "pioneer.one.01x01.avi",        //show with alt-long-md
    "pioneer.one.season.1.episode.1.avi", //show with full md //never seen
    "pioneer.one.1001.avi",         //show with unmarked md
    //"pioneer.one.2014.217.avi",     //show with year & unmarked short-md; unsupported
    //"pioneer.one.2014.1017.avi",    //show with year & unmarked long-md; unsupported
    "pioneer.one.2014.s01e01.avi",  //show with year & long-md
    "pioneer.one.101.s01e01.avi",        //show with stamp & long-md; unsupported
    "pioneer.one.101.2014.s01e01.avi"   //total fuck up ; unsupported
];

shows.forEach(function(str) {
	tape("show test - "+str, function(t) {
		var x = parser(str);
		t.equals(x.type, "series");
		t.equals(x.name, "pioneer one");
		if (x.year) t.equals(x.year, 2014);
		t.equals(x.season, 1);
		t.equals(x.episode && x.episode[0], 1);
		t.end();
	})
});

var movies = [
 // "pioneer.one.avi",        //movie
  "pioneer.one.2014.avi",   //movie with year
  "pioneer.one.201.2014.avi",   //movie with stamp & year
  //"pioneer.one.1980.2014.avi",  //movie with longstamp & year (new movie)
  //"pioneer.one.2020.2014.avi"   //movie with longstam & year (old movie)
];

console.log(parser("South.Park.S20E07.Oh.Jeez.720p.Uncensored.Web-DL.EN-Sub.x264-[MULVAcoded].mkv"))
movies.forEach(function(str) {
	tape("movie test - "+str, function(t) {
		var x = parser(str);
		t.equals(x.type, "movie");
		t.equals(x.name, "pioneer one");
		t.equals(x.year, 2014);
		t.end();
	})
});
