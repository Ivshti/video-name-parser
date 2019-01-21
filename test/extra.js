var test = require("tape");
var parser = require("../index");

var filepaths = [
    'The Nutcracker And The Four Realms (2018) [BluRay] [1080p] [YTS.AM]/The.Nutcracker.And.The.Four.Realms.2018.1080p.BluRay.x264-[YTS.AM].mp4',
    'Hunter Killer (2018) [BluRay] [1080p] [YTS.AM]/Hunter.Killer.2018.1080p.BluRay.x264-[YTS.AM].mp4',
    'Marvels.The.Punisher.S02.WEB.x264-STRiFE[ettv]/marvels.the.punisher.s02e01.web.x264-strife.mkv',
    'True.Detective.S03E03.HDTV.x264-TURBO[eztv].mkv',
    'Bumblebee.2018.1080p.KORSUB.HDRip.x264.AAC2.0-STUTTERSHIT/Bumblebee.2018.1080p.KORSUB.HDRip.x264.AAC2.0-STUTTERSHIT.mkv',
    'Bumblebee.2018.HC.HDRip.XviD.AC3-EVO[TGx]/Bumblebee.2018.HC.HDRip.XviD.AC3-EVO.avi',
    'IO (2019) [WEBRip] [720p] [YTS.AM]/IO.2019.720p.WEBRip.x264-[YTS.AM].mp4',
    'Star.Trek.Discovery.S02E01.WEBRip.x264-PBS[ettv]/Star.Trek.Discovery.S02E01.WEBRip.x264-PBS[ettv].mkv',
    '[Vixen] Ellie Leen - Without Even Trying - Camgirl 39 Pro Debut [1080p]',
    'Camgirl (Wicked Pictures) XXX WEB-DL NEW 2018/Camgirl.mp4',
    'SpyFam - Ana Rose - Stepsis Busts Stepbro On Hidden Shower Cam',
    '[U3-Web] BLAME! Movie (2017) [NF HEVC-10bit 1080p HDR10 E-AC-3+Dolby_Atmos] [Multi-Audio] [Multi-Subs].mkv'
]

test('test: ' + filepaths[0], function (t) {
    var x = parser(filepaths[0], { getExtra: true })
    var extra = x.extra
    t.equals(x.type, 'movie')
    t.equals(x.year, 2018)
    t.equal(extra.resolution[0], '1080p')
    t.equal(extra.codec[0], 'x264')
    t.equal(extra.audio[0], undefined)
    t.equal(extra.lowQualitySrc[0], undefined)
    t.equal(extra.highQualitySrc[0], 'bluray')
    t.end()
})

test('test: ' + filepaths[1], function (t) {
    var x = parser(filepaths[1], { getExtra: true })
    var extra = x.extra
    t.equals(x.type, 'movie')
    t.equals(x.year, 2018)
    t.equal(extra.resolution[0], '1080p')
    t.equal(extra.codec[0], 'x264')
    t.equal(extra.audio[0], undefined)
    t.equal(extra.lowQualitySrc[0], undefined)
    t.equal(extra.highQualitySrc[0], 'bluray')
    t.end()
})

test('test: ' + filepaths[2], function (t) {
    var x = parser(filepaths[2], { getExtra: true })
    var extra = x.extra
    t.equals(x.type, 'series')
    t.equals(x.year, undefined)
    t.equal(extra.resolution[0], undefined)
    t.equal(extra.codec[0], 'x264')
    t.equal(extra.audio[0], undefined)
    t.equal(extra.lowQualitySrc[0], undefined)
    t.equal(extra.highQualitySrc[0], 'web')
    t.end()
})

test('test: ' + filepaths[3], function (t) {
    var x = parser(filepaths[3], { getExtra: true })
    var extra = x.extra
    t.equals(x.type, 'series')
    t.equals(x.year, undefined)
    t.equal(extra.resolution[0], undefined)
    t.equal(extra.codec[0], 'x264')
    t.equal(extra.audio[0], undefined)
    t.equal(extra.lowQualitySrc[0], undefined)
    t.equal(extra.highQualitySrc[0], 'hdtv')
    t.end()
})

test('test: ' + filepaths[4], function (t) {
    var x = parser(filepaths[4], { getExtra: true })
    var extra = x.extra
    t.equals(x.type, 'movie')
    t.equals(x.year, 2018)
    t.equal(extra.resolution[0], '1080p')
    t.equal(extra.codec[0], 'x264')
    t.equal(extra.audio[0], 'aac2.0')
    t.equal(extra.lowQualitySrc[0], undefined)
    t.equal(extra.highQualitySrc[0], 'hdrip')
    t.end()
})

test('test: ' + filepaths[5], function (t) {
    var x = parser(filepaths[5], { getExtra: true })
    var extra = x.extra
    t.equals(x.type, 'movie')
    t.equals(x.year, 2018)
    t.equal(extra.resolution[0], undefined)
    t.equal(extra.codec[0], 'xvid')
    t.equal(extra.audio[0], 'ac3')
    t.equal(extra.lowQualitySrc[0], undefined)
    t.equal(extra.highQualitySrc[0], 'hdrip')
    t.end()
})

test('test: ' + filepaths[6], function (t) {
    var x = parser(filepaths[6], { getExtra: true })
    var extra = x.extra
    t.equals(x.type, 'movie')
    t.equals(x.year, 2019)
    t.equal(extra.resolution[0], '720p')
    t.equal(extra.codec[0], 'x264')
    t.equal(extra.audio[0], undefined)
    t.equal(extra.lowQualitySrc[0], undefined)
    t.equal(extra.highQualitySrc[0], 'webrip')
    t.end()
})

test('test: ' + filepaths[7], function (t) {
    var x = parser(filepaths[7], { getExtra: true })
    var extra = x.extra
    t.equals(x.type, 'series')
    t.equals(x.year, undefined)
    t.equal(extra.resolution[0], undefined)
    t.equal(extra.codec[0], 'x264')
    t.equal(extra.audio[0], undefined)
    t.equal(extra.lowQualitySrc[0], undefined)
    t.equal(extra.highQualitySrc[0], 'webrip')
    t.end()
})

test('test: ' + filepaths[8], function (t) {
    var x = parser(filepaths[8], { getExtra: true })
    var extra = x.extra
    t.equals(x.type, 'other')
    t.equals(x.year, undefined)
    t.equal(extra.resolution[0], '1080p')
    t.equal(extra.codec[0], undefined)
    t.equal(extra.audio[0], undefined)
    t.equal(extra.lowQualitySrc[0], undefined)
    t.equal(extra.highQualitySrc[0], undefined)
    t.end()
})

test('test: ' + filepaths[9], function (t) {
    var x = parser(filepaths[9], { getExtra: true })
    var extra = x.extra
    t.equals(x.type, 'other') // Fails (detected as movie) because of the year
    t.equals(x.year, 2018)
    t.equal(extra.resolution[0], undefined)
    t.equal(extra.codec[0], undefined)
    t.equal(extra.audio[0], undefined)
    t.equal(extra.lowQualitySrc[0], undefined)
    // TODO: check the issue with 'web' and 'web-dl' - why does not match 'web'
    // the regex match the first one in the array (web-dl|web) ...
    t.isNotEqual(extra.highQualitySrc.indexOf('web-dl'), -1)
    t.end()
})

test('test: ' + filepaths[10], function (t) {
    var x = parser(filepaths[10], { getExtra: true })
    var extra = x.extra
    t.equals(x.type, 'other')
    t.equals(x.year, undefined)
    t.equal(extra.resolution[0], undefined)
    t.equal(extra.codec[0], undefined)
    t.equal(extra.audio[0], undefined)
    t.equal(extra.lowQualitySrc[0], 'cam') // It is not cam source it is shower cam with no other src
    t.equal(extra.highQualitySrc[0], undefined)
    t.end()
})

test('test: ' + filepaths[11], function (t) {
    var x = parser(filepaths[11], { getExtra: true })
    var extra = x.extra
    t.equals(x.type, 'movie')
    t.equals(x.year, 2017)
    t.equal(extra.resolution[0], '1080p')
    t.equal(extra.codec[0], 'hevc')
    t.isNotEqual(extra.audio.indexOf('ac-3'), -1)
    t.isNotEqual(extra.audio.indexOf('dolby'), -1)
    t.isNotEqual(extra.audio.indexOf('atmos'), -1)
    t.equal(extra.lowQualitySrc[0], undefined)
    t.equal(extra.highQualitySrc[0], 'web')
    t.end()
})