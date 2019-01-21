'use strict '

var {
    keywordType,
    resolutionKeywords,
    codecKeywords,
    audioKeywords,
    lowQualityReleaseKeywords,
    highQualityReleaseKeywords,
    allKeywords
} = require('./keywords')

var leftBoundary = '(^|(?<=([\\[\\]\\(\\)\\. \\-;,_\/\\\\+]){1}))'
var rightBoundary = '((?=[\\[\\]\\)\\)\\. \\-; ,_\/\\\\+]{1})|$)'
var allKeywordsPattern = '\(' + allKeywords.join('|') + '\)'
var allKeywordsRegEx = new RegExp(leftBoundary + allKeywordsPattern + rightBoundary, 'gi')

var keywordsWithType = (function () {
    var allKeywordsObj = {}

    function addToAllKeywords(arr, type) {
        return arr.forEach(element => {
            allKeywordsObj[element] = type
        })
    }

    addToAllKeywords(resolutionKeywords, keywordType.resolution)
    addToAllKeywords(codecKeywords, keywordType.codec)
    addToAllKeywords(audioKeywords, keywordType.audio)
    addToAllKeywords(lowQualityReleaseKeywords, keywordType.lowQualitySrc)
    addToAllKeywords(highQualityReleaseKeywords, keywordType.highQualitySrc)

    return allKeywordsObj
}())

function pushUniqueToArray(arr, val) {
    if (arr.indexOf(val) < 0) {
        arr.push(val)
    }
}

function getExtra(filePath) {
    var extraData = { resolution: [], audio: [], codec: [], lowQualitySrc: [], highQualitySrc: [], }

    if (!filePath
        || (typeof filePath !== 'string')) {
        return extraData
    }

    var match = filePath.match(allKeywordsRegEx)

    if (match)
        match.reduce(function (extra, m) {
            m = m.toLowerCase()
            switch (keywordsWithType[m]) {
                case keywordType.resolution:
                    pushUniqueToArray(extra.resolution, m)
                    break;
                case keywordType.audio:
                    pushUniqueToArray(extra.audio, m)
                    break;
                case keywordType.codec:
                    pushUniqueToArray(extra.codec, m)
                    break;
                case keywordType.lowQualitySrc:
                    pushUniqueToArray(extra.lowQualitySrc, m)
                    break;
                case keywordType.highQualitySrc:
                    pushUniqueToArray(extra.highQualitySrc, m)
                    break;
                default:
                    break;
            }

            return extra

        }, extraData)

    return extraData
}

module.exports = {
    getExtra: getExtra
}