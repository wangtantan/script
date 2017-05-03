"use strict";

const async = require('async');
const csv = require('csv');
const fs = require('fs');

let startLineNum = 2;
let files = ['deal'];

for (let file of files) {
    run(file);
}


function run(file) {
    mySeries({
        data: (_cb) => {
            fs.readFile(`./data/${file}.csv`, 'utf-8', _cb);
        },
        csv: (_cb, ret) => {
            csv.parse(ret.data, (err, arr) => {
                if (err) return _cb(err);
                _cb(null, arr);
            });
        },
        write: (_cb, ret) => {
            //console.log(ret.csv);
            fs.writeFile(`./data/${file}_pak.txt`, packageStr(ret.csv), 'utf-8', _cb);
        },
    }, (err, ret) => {
        if (err) return console.log(err);
        console.log(`finash ${file}`);
    });
}

function mySeries(tasks, callback) {
    let prev;
    for (let i in tasks) {
        let task = tasks[i];
        if (prev) {
            tasks[i] = [prev, task];
        } else {
            tasks[i] = task;
        }
        prev = i;
    }
    async.auto(tasks, callback);
};

function reverse(arr) {
    let len = arr.length;
    let rsvArr = [];
    if (len <= 3) return rsvArr;
    for (let i = startLineNum; i < len; i += 2) {
        rsvArr.push(arr[i][0].split(';'));
    }
    return rsvArr;
}

function buildStr(arr) {
    return `\"${arr[0]}_${arr[1]}_${arr[2]}\": \"${arr[3]}\",\n`;
}

function packageStr(arr) {
    let ht = arr.length;
    let str = '';
    for (let h = 1; h < ht; h++) {
        str += buildStr(arr[h]);
    }
    str += '\n';
    console.log(str);
    return str;
}

function getGender(num, width) {//1: male, 2: famale
   if (num < width/2) return 1;
   return 2;
}
