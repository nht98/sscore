const request = require('request-promise-native');
const cheerio = require('cheerio');

module.exports = function () {
    var __JAR__
        = this.__JAR__
        = request.jar();
    var __HEADERS__
        = this.__HEADERS__
        = {
            'User-Agent' : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36"
        };

    var Client = this.Client =  request; // init default client

    this.SetCookies = function (cookies) {
        if (!Array.isArray(cookies)) {
            cookies = [cookies];
        }
        cookies.forEach(function (cookie) {
            __JAR__.setCookie(request.cookie(cookie));
        });
    };

    this.ParseHtml = function (htmlString) {
        return cheerio.load(htmlString);
    };
    this.Get = function (url, callback) {
        return Client.get(
            {
                headers: __HEADERS__,
                jar: __JAR__,
                url: url,
                callback: callback,
            }
        );
    };
    this.Post = function (url, data, callback) {
        return Client.post(
            {
                headers: __HEADERS__,
                jar: __JAR__,
                url: url,
                form: data,
                callback: callback,
            }
        );
    };
};

module.exports.ParseHtml = function (htmlString) {
    return cheerio.load(htmlString);
};

module.exports.Client =  request; // init default client

module.exports.Get = function (url, callback) {
    return request.get(
        {
            followAllRedirects: true,
            url: url,
            callback: callback,
        }
    );
};
module.exports.Post = function (url, data, callback) {
    return request.post(
        {
            followAllRedirects: true,
            url: url,
            form: data,
            callback: callback,
        }
    );
};
