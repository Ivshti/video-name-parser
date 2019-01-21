'use strict '

var keywordType = {
    none: 0,
    resolution: 1,
    audio: 2,
    codec: 3,
    lowQualitySrc: 4,
    highQualitySrc: 5,
}

var resolutionKeywords = ['1080p', '1080i', '1920x1080', '720p', '720i', '480p', '480i', '1440p', '1440i', '2k', '2160p', '2160i', '3840x2160', '4k'];

var codecKeywords = ['divx', 'xvid', 'x264', 'x265', 'h264', 'hevc', 'avchd'];

var audioKeywords = ['dts', 'dts-hd', 'acc', 'aac2.0', 'aac 2.0', 'mp3', 'wav', 'truehd', 'ac3', 'ac-3', 'atmos', 'dtsma', 'dolby', 'dolbydigital', 'dolby-digital', 'eac3'];

var lowQualityReleaseKeywords = ['camrip', 'cam', 'ts', 'hdts', 'telesync', 'pdvd', 'predvdrip', 'wp', 'workprint', 'tc', 'hdtc', 'telecine',
    'src', 'screener', 'dvdscr', 'dvdscreener', 'bdscr', 'ddc', 'r5'];

var highQualityReleaseKeywords = ['ppv', 'ppvrip', 'dvdrip', 'dvdmux', 'dvdr', 'dvd-full', 'full-rip', 'iso rip', 'lossless rip', 'untouched rip', 'dvd-5', 'dvd-9', 'dsr',
    'dsrip', 'satrip', 'dthrip', 'dvbrip', 'hdtv', 'pdtv', 'dtvrip', 'tvrip', 'hdtvrip', 'vodrip', 'vodr', 'webdl', 'web dl', 'web-dl', 'web', 'hdrip', 'web-dlrip', 'webrip',
    'web-cap', 'webcap', 'web cap', 'blu-ray', 'bluray', 'bdrip', 'bdrip', 'brrip', 'bdmv', 'bdr', 'bd25', 'bd50', 'bd5', 'bd9', 'ultrahd', 'remux'];

var allKeywords = resolutionKeywords.concat(codecKeywords).concat(audioKeywords).concat(lowQualityReleaseKeywords).concat(highQualityReleaseKeywords)

module.exports = {
    keywordType: keywordType,
    resolutionKeywords: resolutionKeywords,
    codecKeywords: codecKeywords,
    audioKeywords: audioKeywords,
    lowQualityReleaseKeywords: lowQualityReleaseKeywords,
    highQualityReleaseKeywords: highQualityReleaseKeywords,
    allKeywords: allKeywords
}