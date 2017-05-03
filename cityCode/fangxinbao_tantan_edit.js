'use strict';

var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var async = require('async');
var fs = require("fs");
var now = new Date();
console.log(__dirname);

var china = [
    {name: "上海", cities: ["shanghai"]},
    {name: "北京", cities: ["beijing"]},
    {name: "重庆", cities: ["chongqing"]},
    {name: "天津", cities: ["tianjin"]},
    {name: "河北", cities: ["shijiazhuang", "baoding", "handan", "cangzhou", "zhangjiakou", "tangshan", "qinhuangdao", "xingtai", "chengde"]},
    {name: "山西", cities: ["taiyang", "xinzhou", "jinzhong", "datong", "linfen"]},
    {name: "内蒙古", cities: ["wuhai", "xingan", "eerduosi", "bayannaoer", "chifeng"]},
    {name: "吉林", cities: ["changchun", "jilin"]},
    {name: "黑龙江", cities: ["haerbin", "mudanjiang", "daqing", "jiamusi", "shuangyashan", "jixi"]},
    {name: "辽宁", cities: ["shenyang", "dalian", "dandong", "fuxin", "tieling"]},
    {name: "山东", cities: ["jinan", "laiwu", "linyi", "zaozhuang", "dongying", "qingdao", "zibo", "heze", "yantai", "binzhou"]},
    {name: "江苏", cities: ["nanjing", "nantong", "suzhou", "suqian", "changzhou", "lianyungang", "wuxi", "jstaizhou", "xuzhou", "yangzhou", "huaian"]},
    {name: "浙江", cities: ["hangzhou", "ningbo", "jiaxing", "wenzhou", "jinhua", "huzhou", "taizhou"]},
    {name: "安徽", cities: ["hefei", "huaibei", "huainan", "maanshan", "bangbu", "bozhou", "anhuisuzhou"]},
    {name: "福建", cities: ["fuzhou", "xiamen", "putian", "quanzhou", "ningde", "longyan"]},
    {name: "广东", cities: ["guangzhou", "foshan", "dongguan", "meizhou", "shenzhen", "zhuhai", "zhongshan"]},
    {name: "广西", cities: ["nanning", "guilin"]},
    {name: "海南", cities: ["haikou"]},
    {name: "河南", cities: ["zhengzhou", "anyang", "zhumadian", "zhoukou", "shangqiu", "xuchang", "luoyang", "luohe", "xinxiang", "nanyang", "jiaozuo", "kaifeng", "sanmenxia"]},
    {name: "湖北", cities: ["wuhan", "suizhou", "jingmen", "yichang", "jingzhou", "huangshi", "shiyan", "enshi"]},
    {name: "湖南", cities: ["changsha", "hengyang", "changde", "chenzhou"]},
    {name: "江西", cities: ["nanchang", "jiangxiyichun", "jiangxifuzhou", "jingdezhen", "ganzhou"]},
    {name: "四川", cities: ["chengdu", "suining", "neijiang", "deyang", "guangyuan", "bazhong", "mianyang", "luzhou", "liangshan"]},
    {name: "云南", cities: ["kunming", "baoshan", "lijiang"]},
    {name: "贵州", cities: ["qiannan", "tongren", "anshun"]},
    {name: "宁夏", cities: ["zhongwei"]},
    {name: "新疆", cities: ["wulumuqi", "bayinguoleng", "yilihasake", "aletai", "tacheng"]},
    {name: "山西", cities: ["xian", "yulin"]},
    {name: "甘肃", cities: ["lanzhou"]},
    {name: "香港", cities: ["xianggang"]},
]
 
;
var cityAgentUrls = [];
var head = "省,姓名,电话,保险公司,地区,自我介绍,微信二维码\n";
var hotCities = [];//做什么用？觉得好像没用到，就被我删掉了
console.log("=========抓取数据开始===========");

var count = 0;
var pageCount = 0;
async.waterfall([
    function(cb) {

        async.each(china, function(province,  cb0) {
            let cities = province.cities;
            let proName = province.name;
            async.each(cities, function(city, cb1) {
                var j = request.jar();
                var cookie = request.cookie('cityCode=' + city);
                var url = 'http://www.fangxinbao.com/yingxiaoyuan';
                j.setCookie(cookie, url)
                request({ url: url, jar: j, encoding: null }, function(err, response, htmlBody) {
                    try {
                        var $ = cheerio.load(iconv.decode(htmlBody, 'gb2312').toString());
                        var numberString = $('.yqbMainCont').find('.salesman').find('.content').find('.salesman').find('.fr').find('strong').text();
                        pageCount = Math.ceil(numberString / 6);
                        cityAgentUrls.push({ url: 'http://www.fangxinbao.com/yingxiaoyuan', cityCode: city, pageCount: pageCount, province: proName });

                    } catch (e) {
                        console.error(e);
                        console.log("city:" + city);
                    }
                    cb1(err, 'fine');
                });
            }, function(err, data) {
                if (err) cb0("cb0:" + err);
                cb0(null, data);
            });
        }, (err, data) => {
            if (err) cb("cb:" + err);
            cb(null, data);
        });
    },

    function(err, cb) {

        var filePath = __dirname + "/fangxinbao-all.csv";
        fs.writeFile(filePath, head, function(err) {
            if (err) cb(err);
            console.log("write head: " + head);
        });
        async.eachSeries(cityAgentUrls, function(cityAgenUrl, callback) {
            var page = 0;
            async.whilst(
                function() { return page < cityAgenUrl.pageCount && cityAgenUrl.pageCount > 0; },
                function(cb20) {
                    page++;

                    console.log('page = ' + page);
                    var j = request.jar();
                    var cookie = request.cookie('cityCode=' + cityAgenUrl.cityCode);
                    var url = 'http://www.fangxinbao.com/yingxiaoyuan/list-' + page + '.html';
                    j.setCookie(cookie, url);
                    request({ url: url, jar: j, encoding: null }, function(error, response, htmlBody) {
                        try {
                            console.log('http://www.fangxinbao.com/yingxiaoyuan/list-' + page + '.html');

                            var $ = cheerio.load(iconv.decode(htmlBody, 'gb2312').toString());

                            async.each($('.yqbMainCont').find('.salesman').find('.content').find('.sm_box2').find('.b_line.clearfix'), function(elem, cb2) {
                                    var agentName = $(elem).find('.floatleft.x2').find('.y1').find('a').text();
                                    var mobile = '';
                                    var company = $(elem).find('.floatleft.x2').find('.y3').find('a').text();
                                    // var company1 = $(elem).find('ul').find('li').eq(1).find('a').eq(0).text();
                                    // var company2 = $(elem).find('ul').find('li').eq(1).find('a').eq(1).text();
                                    var area = $(elem).find('.floatleft.x2').find('.y1').find('span').text().replace(company, '').replace(/(^\s*)|(\s*$)/g, "");
                                    var qrUrl = '';

                                    var personPage = $(elem).find('.floatleft.x2').find('.y1').find('a').attr('href').replace('www', 'm');
                                    async.waterfall([function(cb10) {
                                            request({ url: personPage, encoding: null }, function(error, response, personBody) {
                                                try {
                                                    var $person = cheerio.load(iconv.decode(personBody, 'gb2312').toString());
                                                    mobile = $person('.banner').last().find('a').text();
                                                    qrUrl = $person('.contanctbox.pdg.wddt').last().find('img').attr('src');

                                                    cb10();
                                                } catch (e) {
                                                    console.error(e);
                                                    console.log("personPage:" + personPage);
                                                    cb10('could not get personPage');
                                                }



                                            });
                                        }

                                    ], function(err) {
                                        // var head = "姓名,电话,保险公司,地区,自我介绍,微信二维码";
                                        if (!err) {
                                            if (agentName) {
                                                agentName = agentName.replace(/(^\s*)|(\s*$)/g, "");
                                            } else {
                                                agentName = "";
                                            }

                                            if (mobile) {
                                                mobile = mobile.replace(/(^\s*)|(\s*$)/g, "");
                                            } else {
                                                mobile = "";
                                            }

                                            if (company) {
                                                company = company.replace(/(^\s*)|(\s*$)/g, "");
                                            } else {
                                                company = "";
                                            }

                                            if (area) {
                                                area = area.replace(/(^\s*)|(\s*$)/g, "");
                                            } else {
                                                area = "";
                                            }



                                            if (qrUrl) {
                                                qrUrl = qrUrl.replace(/(^\s*)|(\s*$)/g, "");
                                            } else {
                                                qrUrl = "";
                                            }

                                            fs.appendFile(filePath, cityAgenUrl.province + "," +agentName + "," + mobile + "," + company + "," + area + "," + qrUrl + "\n", function(err) {
                                                console.log("追加数据成功==" + count++);
                                            });
                                        }
                                        cb2();
                                    });
                                },
                                function(err) {
                                    cb20();
                                });
                        } catch (e) {
                            console.error(e);
                            cb20();
                        }

                    });
                },
                function(err) {
                    callback();
                });

        }, function(err) {
            err ? cb("cb err: " + err) : cb(err, "fanished");
        });

    }


], function(err, results) {
    if (err) {
        console.log("======================   failed");
    } else {
        console.log("======================   succeed");
    }

    console.log("hotCities = " + JSON.stringify(hotCities));
});
