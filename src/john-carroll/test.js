var casper = require('casper').create({
    verbose: true,   
    logLevel: 'debug',
    pageSettings: {
        loadImages: false, // The WebPage instance used by Casper will
        loadPlugins: false // use these settings
    },
    clientScripts: [
        "lib/jquery.js"
    ],
    onError: function(self,m){//错误回调函数  
        console.log("onError===========================FATAL:" + m);  
        self.exit();  
    },  
    onAlert: function (msg) {//alert的回调函数  
        console.log("onAlert===========================msg:" + msg);  
    }  
});

var test = [];

// casper.start('https://portals.veracross.com/jcs/login', function(){
//     this.evaluate(function(username, password){
//         document.querySelector('#username').value = username;
//         document.querySelector('#password').value = password;
//         document.querySelector('#login-button').click();
//     }, 'liyan19@jcpatriot.org', 'Leon20000608');
// });
// https://portals.veracross.com/jcs/student
casper.start('abc.html', function() {
    //casper.getDataAndUrl('abc.html');
})

casper.getDataAndUrl = function(url){
    casper.thenOpen(url, function() {
    　　//console.log(this.getCurrentUrl());
    });
};
// 获取主页面的信息
casper.then(function getItems(){
    var basePath = 'src/john-carroll/download';
    var data = casper.evaluate(function() {
        var items = [];
        var baseUrl = 'https://portals.veracross.com';
        var undefinedCheck = function(value){
            if (value != 'undefined' && value != '' && typeof value !== "undefined") {
                return true;
            }
            return false;
        }
        $('.class-list li[data-status="active"]').each(function(index, element){
            var unit = {};
            var coreUrl = '';
            var classUrl = '';
            var classText = $(this).find('.title a').text();
            var coreUrlTmp = $(this).find('.course-notifications .calculated-grade').attr('href');
            if (undefinedCheck(coreUrlTmp)) {
                coreUrl = baseUrl + coreUrlTmp;
            }
            var classUrlTmp = $(this).find('.title  a').attr('href');
            if (undefinedCheck(classUrlTmp)) {
                classUrl = baseUrl + classUrlTmp;
            }
            unit = {
                'classUrl' : classUrl,
                'classText': classText,
                'scoreUrl' : coreUrl,
                'scoreText': $(this).find('.course-notifications .calculated-grade .numeric-grade').text()
            };
            items.push(unit);
        });
        return items;
    });
    test = data;
    //需要对url进行循环访问，获取教师资料信息
    for (var i = data.length-1; i >= 0; i--) {
        var teacherPath = basePath + '/teacher/'+data[i].classText+'.html';
        var scorePath   = '';
        if (data[i].classUrl != '') {
            //casper.download(data[i].classUrl, teacherPath);
        }
        if (data[i].scoreUrl != '') {
            //casper.download(data[i].scoreUrl, scorePath);
            scorePath = basePath + '/score/'+data[i].classText+'.html';
        }
        data[i].scorePath = scorePath;
        casper.teacher(teacherPath, i, data);
    }
});

// 获取教师的资料信息
casper.teacher = function(url, i, data){
    casper.thenOpen(url);
    casper.then(function(){
        var result = casper.evaluate(function(i, data) {
            data[i].teachName = $('.info h4').text();
            data[i].email     = $('.info a').attr('href');
            $('.info h4').remove();
            $('.info a').remove();
            $('.info br').remove();
            data[i].mobile    = $.trim($('.info').html());
            return data;
        }, i, data);
        // 将数据赋值给全局变量
        test[i] = result[i];
        if (data[i].scorePath) {
            // 调用分数分析函数
            casper.quarter(data[i].scorePath, i, result);
        }
    });
    
}
// 获取分数的资料信息
casper.quarter = function(url, i, data){
    // Quarter汇总页面
    casper.thenOpen(url);
    casper.then(function(){
        var result = casper.evaluate(function() {
            var items = [];
            $('.left-controls a').each(function(){
                items.push($(this).attr('href'));
            });
            return items;
        });
        // 必须先定义，然后后面才可以使用
        test[i].score = [];
        for (var j = result.length - 1; j >= 0; j--) {
            var h = j + 1;
            var path = 'src/john-carroll/download/score/quarter/' + data[i].classText+'-'+ h + '.html';
            //casper.download(result[j], 'src/john-carroll/download/score/quarter/' + data[i].classText+'-'+h + '.html');
            if (h != 4) {
                casper.score(path, i, h);
            }
        }
    });
}
// 获取一个学期分数的资料信息
casper.score = function(url, i, h){
    casper.thenOpen(url);
    casper.then(function(){
        var result = casper.evaluate(function() {
            var items = [];
            $('.data_table:first tbody tr').each(function(){
                var unit = {
                    label: $(this).find('.description strong').text(),
                    earned:$(this).find('.points_earned').text(),
                    possible:$(this).find('.points_possible').text(),
                    average:$(this).find('.average').text(),
                };
                items.push(unit);
            });
            return items;
        });
        // i 第几个课程，h 第几个学期成绩，result 具体成绩，是个数组
        test[i].score[h] = result;
    });
}
// 处理最终的数据
casper.then(function(){
    for (var i = test.length-1; i >= 0; i--) {
        //i 具体哪个课程
        var item = test[i];
        console.log(item.classUrl);
        console.log(item.classText);
        console.log(item.scoreUrl);
        console.log(item.scoreText);
        console.log(item.teachName);
        console.log(item.email);
        console.log(item.mobile);
        // 分数，包括学期，学期包括成绩分项
        var score = item.score;
        if (score instanceof Array) {
            // 成绩列表是数组 j 学期
            for (var j = score.length - 1; j > 0; j--) {
                console.log('学期'+j);
                var unit = score[j];
                for (var h = unit.length - 1; h >= 0; h--) {
                    console.log(unit[h].label);
                    console.log(unit[h].earned);
                    console.log(unit[h].possible);
                    console.log(unit[h].average);
                }
            }
        }
    }
});

casper.run();


