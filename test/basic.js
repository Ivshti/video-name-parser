var tape = require("tape");
var parser = require("../index");

tape("parses show, classic stamp", function(t) {
    var x = parser("pioneer.one.s01e05.hdtv.mp4");
    t.equals(x.type, "series");
    t.equals(x.name, "pioneer one");
    t.equals(x.season, 1);
    t.equals(x.episode[0], 5);
    t.end();
})
