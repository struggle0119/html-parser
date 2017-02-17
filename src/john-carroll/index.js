/**
 * @fileOverview 入口文件
 * @author struggle0119
 */

'use strict'

// 引用外部包
var superagent = require('superagent')
    , path = require('path')
    , packageData = require('../../package.json')
    , chalk = require('chalk')
    , fs = require("fs")
    , optimist = require("optimist");

var argv = optimist.argv.option;

// 解析package.json文件
var app = packageData.app
    , ignoreResolve = app.ignoreResolve;

// 定义命令错误和正确的输出颜色
var error = chalk.bold.red
    , success = chalk.bold.green;

// 定义文件位置
const libPath  = path.normalize(__dirname + '/../../lib/');

var db = require(libPath + 'mysql');

var query = db.query('SELECT * FROM test', function(results) {
    // 处理结果
    console.log(results);
});

/**
 * 定义入口函数
 */
function main() {
    // 执行登录操作
    // 解析html
    // 写入数据
    // 登出系统
}
