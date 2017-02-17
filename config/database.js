/**
 * @fileOverview 链接mysql
 * @author struggle0119
 */
'use strict'

function DbConfig() {
    var mysql = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'schools'     
    }

    return mysql;
}

module.exports = new DbConfig();