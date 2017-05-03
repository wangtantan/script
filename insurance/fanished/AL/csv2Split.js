"use strict";

const async = require('async');
const csv = require('csv');
const fs = require('fs');

let startLineNum = 0;
//let files = ['ALLXRSNX'];
//let files = ['ALLXRSZN'];
let files = ['ALDLWXHWYD'];

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
                let newArr = arr.map((ele) => {return ele[0].split(",");});
                console.log(newArr);
                _cb(null, newArr);
                //_cb(null, reverse(arr));
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
    if (len <= 1) return rsvArr;
    for (let i = startLineNum; i < len; i += 2) {
        rsvArr.push(arr[i][0].split(';'));
    }
    return rsvArr;
}

//console.log(buildStr(1, 2, 3, '4') + buildStr(1, 2, 3, '4'));
function buildStr(planCode, termCode, jobType, premium) {
    if (premium === '') return '';
    premium = parseFloat(premium).toFixed(2);
    return `\"planCode_${planCode}|termCode${termCode}\": \"${premium}\",\n`;
    return `\"planCode_${planCode}|termCode${termCode}\": \"${premium}\",\n`;
}

//console.log(buildStr(getGender(2, 5), 1, 1, 2));
function packageStr(arr) {
    let ht = arr.length,
        wd = arr[0].length;
    let str = '';
    for (let w = 1; w < wd; w++) {
        for (let h = 1; h < ht; h++) {
            str += buildStr(arr[0][w], arr[h][0], arr[h][1], arr[h][w]);
        }
        str += '\n';
    }
    return str;
}

function getGender(num, width) {//1: male, 2: famale
   if (num < width/2) return 1;
   return 2;
}
