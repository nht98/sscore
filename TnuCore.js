const request = require('request');
const cheerio = require('cheerio');
const { JSDOM } = require('jsdom');

var ICTU = require("./DataSource/ICTU");
var TNUS = require("./DataSource/TNUS");
var TUE = require("./DataSource/TUE");
var TnuSchools = {
    "ICTU": ICTU,
    "TNUS": TNUS,
    "TUE": TUE
};

function Open (schoolCode) {
    if (!!TnuSchools[schoolCode]) {
        return new TnuSchools[schoolCode];
    }
};

module.exports.TnuSchools = TnuSchools;
module.exports.Open = Open;
