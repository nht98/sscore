# xls-parse

### Install
````
npm install xls-parse
````

### use node

````
"use strict";
var xlsParse = require("xls-parse");
var file = "./myxlsfile.xls";
var sheetName = "mysheetname";
var sorts = {}; //object or array
var without = []; //array
var data = xlsParse.formatXls2Obj(file, sheetName, sorts, without);
console.log(data); //output xls format data

````
#### Api

* formatXls2Obj(file, sheetName, sorts, without)
    * @param {string} file
    * @param {string} sheetName
    * @param {array|object} sorts
    * @param {array} without
    * @return {array}


### install cli
````
npm install -g xls-parse
````

#### cli usage
````
 Usage: xls-parse [options]

  Options:

    -h, --help                       output usage information
    -V, --version                    output the version number
    -f, --file <filepath>            xls file path
    -o, --outfile <outfile>          outfile path
    --sheetname <sheetname>          xls sheetname
    --sorts <sort config>            sorts config is a json {Array | Object}
    --without <without line number>  without line number is a json {Array}

  Examples:

    $ xlsparse -f <file> -o <outfile> [--sheetname sheet1] [--sorts '{"name" : 1, "age": 0}'] [--without '[1,2,3,4]']
    $ xlsparse -f <file> -o <outfile> [--sheetname sheet1] [--sorts '[2,1,4]'] [--without '[1,2,3,4]']
````
