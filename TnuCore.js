const request = require('request');
const cheerio = require('cheerio');
const { JSDOM } = require('jsdom');

var ICTU = require("./DataSource/ICTU");

var TnuSchools = {
    "ICTU": ICTU,
    "DTC": ICTU,
};

function Open (schoolCode) {
    if (!!TnuSchools[schoolCode]) {
        return new TnuSchools[schoolCode];
    }
};

module.exports.TnuSchools = TnuSchools;
module.exports.Open = Open;
