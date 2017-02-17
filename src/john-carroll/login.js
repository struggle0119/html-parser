/**
 * @fileOverview 登录操作
 * @author struggle0119
 */

'use strict'

// 引用外部包
var request = require('superagent')
    , path = require('path')
    , packageData = require('../../package.json')
    , chalk = require('chalk')
    , fs = require("fs")
    , optimist = require("optimist")
    , cheerio = require('cheerio');

// 定义返回对象
var login = {};
 request
       .get('https://portals.veracross.com/jcs/login')
       .end(function(err, res){
                var cookie0 = res.header['set-cookie'][0];
                var cookie1 = res.header['set-cookie'][1];
                var cookie2 = res.header['set-cookie'][2];
                var cookie3 = res.header['set-cookie'][3];
                var $ = cheerio.load(res.text);
                var token = $('input[name=authenticity_token]').val();
                request.post('https://accounts.veracross.com/jcs/authenticate')
                    .send({username: 'liyan19@jcpatriot.org', password: 'Leon20000608'
                        , authenticity_token:token, application:'Portals', remote_ip:'114.242.157.226'
                        , return_to:'https://portals.veracross.com/jcs/session', commit: 'Log In' })
                    // .set('X-API-Key', 'foobar')
                    .set('Accept', 'application/json')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .set('Cookie', cookie0 + ';' + cookie1 + ';' + cookie2 + ';' + cookie3)
                    .end(function(err, res1){
                        var cookie = res1.header['set-cookie'];
                        console.log(res1);
                        // request
                        //     .post('https://portals.veracross.com/jcs/session')
                        //     .send({authenticity_token:token, account:})
                        //     .set('Cookie', cookie0 + ';' + cookie1 + ';' + cookie2 + ';' + cookie3)
                        //     .end(function(err, res2){
                        //         console.log(res2);
                        //     });
                });
       });


