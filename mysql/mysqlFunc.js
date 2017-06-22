'use strict'

var Promise = require('bluebird');
var mysql = require('promise-mysql');
var conf = require('./config');

var _ = require('lodash');
var moment = require('moment');

let sql = function() {
    let self = {};
    return {
        config: (dbName) => {
            self.pool = mysql.createPool(conf[dbName]);
        },
        testConnect: (cb) => {
            self.pool.getConnection().then(conn => {
                conn.beginTransaction();
                console.log("test: connection succeed");
                cb(null, conn);
            }).catch(err => {
                console.log("test: connection failed");
                cb(err);
            });
        },
        get: (cmd, cb) => {
            self.pool.query(cmd).then(data => {
                console.log("test: get data", data);
                cb(null, data);
            }).catch(err => {
                console.log("test: get failed");
                cb(err);
            });
        },
        set: (table, obj, cb) => {
            self.pool.query('insert into `' + table + '` set ?', obj).then(data => {
                console.log("test: set data", data);
                cb(null, data);
            }).catch(err => {
                console.log("test: set failed");
                cb(err);
            });
        },
    };//return
};

module.exports = Promise.promisifyAll(sql());
