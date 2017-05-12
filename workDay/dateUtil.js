'use strict';
var Promise = require('bluebird');
var moment = require('moment');
var _ = require('lodash');

var holiday = require('./holiday');
for (let i = 2; i < 10; i++) {
    let startDate = moment("2017-05-13 00:00:00");//云运行稳定后删除该段测试
    let result = calWithoutHoliday(startDate, i * 0.5, 'd');
    console.log(startDate.format("YYYY-MM-DD HH:mm:ss") + " before: " + i*0.5 + "days: " + result.format("YYYY-MM-DD HH:mm:ss"));
}
//for (let i = 0; i < 10; i++) {
//    let result = calWithHoliday(startDate, i * 0.5, 'd');
//    //console.log(startDate.format("YYYY-MM-DD HH:mm:ss") + " before: " + i*0.5 + "days: " + result.format("YYYY-MM-DD HH:mm:ss"));
//}
//process.exit(0);

function formatDate(date) {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
};
exports.formatDate = formatDate;

function calPayOutTime(startDate, startDateInterval, posponeHolidayFlag) {
    if (!startDateInterval) return Promise.reject("coProduct未加载startDateInterval");
    let num = startDateInterval.substr(0,startDateInterval.length-1);
    let unit = startDateInterval.substr(startDateInterval.length-1, 1);
    let payOutTime;
    if (posponeHolidayFlag) {
        payOutTime = calWithoutHoliday(startDate, num, unit);
    } else {
        payOutTime = calWithHoliday(startDate, num, unit);
    };
    return payOutTime;
}
exports.calPayOutTime = calPayOutTime;

function calWithHoliday(startDate, num, unit) {
    let interval = num + unit;
    if (unit == 'd') { num = 24 * num; unit = 'h'; }
    if (unit != 'h') return Promise.reject("startDateInterval不合格: " + startDateInterval);
    num = num < 24 ? 0 : num - 24;
    let payOutTime = moment(startDate).subtract(num, unit);
    console.log(
        "calPayOutTime(withHoliday): " + formatDate(startDate) + " "
        + interval + " before is " + formatDate(payOutTime)
    );

    return payOutTime;
}

function calWithoutHoliday(startDate, num, unit) {
    let interval = num + unit;
    if (unit == 'd') { num = 24 * num; unit = 'h'; }
    if (unit != 'h') return Promise.reject("startDateInterval不合格: " + startDateInterval);
    num = num < 24 ? 0 : num - 24;
    let tmpDate = moment(startDate);
    console.log("       " + formatDate(tmpDate));
    while (theDayBeforeHoliday(tmpDate)) {
        console.log("a xi ba");
        tmpDate = tmpDate.subtract(24, 'h');
    };
    let targetDate = tmpDate;
    console.log({startDate: formatDate(startDate), targetDate: formatDate(targetDate), tmpDate: formatDate(tmpDate)});
    while (num > 0) {
        tmpDate = tmpDate.subtract(24, 'h');
        if (!theDayBeforeHoliday(tmpDate)) {//工作日
            targetDate = tmpDate;
            num -= 24;
        }
    };
    let payOutTime = num == 0 ? targetDate : tmpDate.add((-num), 'h');
    //console.log(
    //    "calPayOutTime(withoutHoliday): " + formatDate(startDate) + " "
    //    + interval + " before is " + formatDate(payOutTime)
    //);

    return payOutTime;
}

function theDayBeforeHoliday(date) {
    let index = moment(+date).subtract(1, 'd').format("YYYYMM.DD");
    console.log("is holiday ==========: " + index)
    return _.get(holiday, index) ? true : false;
}
