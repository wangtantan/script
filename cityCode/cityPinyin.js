'use strict';
var moment = require('moment');
var transPY = require('pinyin');

let china = require('./data/city.json');
let newChina = {};
let provinces = china.province;
let count = 0;
for (let pIndex = 0; pIndex < provinces.length; pIndex++) {
    let province = provinces[pIndex];
    let cities = province.city;
    for (let cIndex = 0; cIndex < cities.length; cIndex++) {
        let city = cities[cIndex];
        //console.log(city);
        //process.exit(0);
        let addressP = transPY(province.name, {segment: true, style: transPY.STYLE_NORMAL});
        let addressC = transPY(city.name, {segment: true, style: transPY.STYLE_NORMAL});
        china.province[pIndex].city[cIndex].pinyin = (addressP.join('') == addressC.join('')) ? addressC.join('') : addressP.join('') + addressC.join('');
        newChina[city.code] = china.province[pIndex].city[cIndex].pinyin;
        //console.log(province.name+city.name + "\t" + addressP.join('') + "-" + addressC.join(''));
    }
}
let pinyinMap = JSON.stringify(newChina, null, "    ");
console.log(pinyinMap);
process.exit(0);
