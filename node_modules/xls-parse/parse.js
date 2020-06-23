"use strict";
var xls = require("xlsjs");
var csvjson = require("csvjson");
var _ = require("underscore");
var fs = require("fs");
/**
 * 返回xls文件数组，并且返回指定数组位的值,当无知值则为字符串空
 * @param {string} file
 * @param {string} sheetName
 * @return {array}
 */
exports.xls2Obj = xls2Obj;
function xls2Obj(file, sheetName) {
    sheetName = sheetName || "";
    //资源为文件
    if(!fs.existsSync(file)) {
        throw new Error("file is not exist");
        return null;
    }
    var workbook = xls.readFile(file);
    //如果指定了sheetName,如果文件sheetName不存在，则返回空数组
    if(sheetName && !workbook.Sheets[sheetName]) {
        return null;
    }
    var sheetList = sheetName ? [sheetName] : workbook.SheetNames;
    var obj = {};
    sheetList.forEach(function(sheet) {
        var csvSource = csvjson.toArray(xls.utils.sheet_to_csv(workbook.Sheets[sheet]));
        obj[sheet] = csvSource;
    });
    return obj;
}

/**
 * 格式化csvArr
 * @param {array} arr
 * @param {array|object} sorts
 * @param {array} without 需要去除格式化的行数
 * @return {object}
 */
exports.arr2Obj = arr2Obj;
function arr2Obj(arr, sorts, without) {
    if(!_.isArray(arr)) {
        return null;
    }
    if(!_.isArray(without) || _.isEmpty(without)) {
        without = [];
    }
    var results = [];
    _.forEach(arr, function(val, key) {
        //过滤需要排除的行
        if(!_.isEmpty(without) && _.indexOf(without, key) >= 0) {
            return;
        }
        //数据排序操作
        results.push(sortArr(val, sorts));
    });
    return results;
}

/**
 * 数据排序格式化
 */
exports.sortArr = sortArr;
function sortArr(arr, sorts) {
    var isArr =  _.isArray(sorts);
    var isObj = _.isObject(sorts) && !isArr;
    var rs = null;
    if(isArr) {
        rs = [];
    }else if(isObj) {
        rs = {};
    } else {
        return arr;
    }
    _.forEach(sorts, function(val, key) {
        if(isArr) {
            rs.push(arr[val] || "");
        } else if(isObj) {
            rs[key] = arr[val] || "";
        }
    });
    return rs;
}

/**
 * 数据xls格式化成数据对象
 * @param {string} file
 * @param {string} sheetName
 * @param {array|object} sorts
 * @param {array} without
 * @return {array}
 */
exports.formatXls2Obj = formatXls2Obj;
function formatXls2Obj(file, sheetName, sorts, without) {
    var sources = xls2Obj(file, sheetName);
    var rs = {};
    if(_.isEmpty(sorts) && _.isEmpty(without)) {
        return sources;
    }
    _.forEach(sources, function(arr, k) {
        rs[k] = arr2Obj(arr, sorts, without);
    });
    return rs;
}
