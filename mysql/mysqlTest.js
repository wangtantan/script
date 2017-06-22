'use strict';

var MYSQL = require('./mysqlFunc');
var Promise = require('bluebird');
var moment = require('moment');

console.log("test: start");
MYSQL.config("local");

let newObj = {
    name: "王潭潭",
    birthday: moment("2017-05-01T16:00:00.000Z"),
    score: 100
}
MYSQL.setAsync("date_table", newObj).then(() => {
    MYSQL.getAsync("select * from date_table;");
}).then(() => {
    //process.exit(0);
}).catch((err) => {
    console.log("err: " + err)
    //process.exit(999);
});
        //MYSQL.testConnect(log);

function run(cb) {
    MYSQL.get("insert into score_table (name, birthday, score) values ( 'zukuan', now(), 90);", (err, data) => {
        MYSQL.get("select * from score_table;", cb) ;
    });
};

function log(err, data) {
    err ? console.log("err: " + err) : console.log("hah: " + data);
}
