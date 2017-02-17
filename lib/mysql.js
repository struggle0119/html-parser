/**
 * @fileOverview 链接mysql
 * @author struggle0119
 */

'use strict'

var mysql = require('mysql')
    , path = require('path')
    , chalk = require('chalk');
// 配置文件位置
const configPath  = path.normalize(__dirname + '/../config/');

var mysqlConfig = require(configPath + 'database');

// 定义命令错误和正确的输出颜色
var error = chalk.bold.red
    , success = chalk.bold.green;

// 定义数据库对象,统一返回该对象
var db = {};

// 执行数据操作
db.query = function(sql, callback) {
    // 创建链接对象
    var connection = mysql.createConnection(mysqlConfig);
    // 链接数据库
    connection.connect(function(err) {
        if (err) {
            console.error(error('数据链接错误：' + err));
            return;
        }
        // console.log(success('链接成功'));
        }
    );
    connection.query(sql, function (err, results, fields) {
        if (err) {
            console.error(error('SQL语句执行错误：' + err)); 
            throw err;
        }
        connection.end();
        // 释放链接
        callback(results, fields);
    });
}

module.exports = db;