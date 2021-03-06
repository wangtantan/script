"use strict";

const async = require('async');
const csv = require('csv');
const fs = require('fs');

let startLineNum = 0;
let files = ["TKLAKFJLWY"];

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
                _cb(null, reverse(arr));
            });
        },
        write: (_cb, ret) => {
            //console.log(ret.csv);
            fs.writeFile(`./data/${file}_pak.txt`, packageStr(ret.csv), 'utf-8', _cb);
        },
    }, (err, ret) => {
        if (err) return console.log(err);
        //console.log(packageStr(ret.csv));
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
    for (let i = startLineNum; i < len; i++) {
        rsvArr.push(arr[i][0].split(';'));
    }
    return rsvArr;
}

//console.log(buildStr(1, 2, 3, '4') + buildStr(1, 2, 3, '4'));
function buildStr(code, age, premium) {
    if (premium === '') return '';
    return `\"planCode_${code}|age_${age}\": \"${premium}\",\n`;
}

//console.log(buildStr(getGender(2, 5), 1, 1, 2));
function packageStr(arr) {
    let ht = arr.length,
        wd = arr[0].length;
    let str = '';
    for (let w = 1; w < wd; w++) {
        for (let h = 1; h < ht; h++) {
            str += buildStr(arr[0][w], arr[h][0], arr[h][w]);
        }
        str += '\n';
    }
    return str;
}
