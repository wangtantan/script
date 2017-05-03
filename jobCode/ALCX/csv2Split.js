"use strict";

const async = require('async');
const csv = require('csv');
const fs = require('fs');
const iconv = require('iconv-lite')

let files = ['career'];

for (let file of files) {
    run(file);
}

function run(file) {
    mySeries({
        data: (_cb) => {
            fs.readFile(`./data/${file}.csv`, _cb);
        },
        csv: (_cb, ret) => {
            csv.parse(iconv.decode(ret.data, 'gb2312'), (err, arr) => {
                if (err) return _cb(err);
                _cb(null, arr);
            });
        },
        write: (_cb, ret) => {
            fs.writeFile(`./data/${file}_pak.json`, packageStr(ret.csv), 'utf-8', _cb);
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


function packageStr(arr) {
    let careerArray = [];
    let counter1st = -1,
        counter2nd = 0;
    let type1st,
        type2nd;
    for (let i = 1; i < arr.length; i++) {
        console.log({i, arr: arr[i]});
        if (arr[i][0]) {
            counter1st++;
            type1st = arr[i][0];
            careerArray.push({//create 1st level code
                text: type1st,
                code: formatCode(counter1st),
                children: []
            });
            if (arr[i][1]) {
                counter2nd = 0;
                type2nd = arr[i][1];
                careerArray[counter1st].children.push({//create 2nd level code
                    text: type2nd,
                    code: formatCode(counter1st) + formatCode(counter2nd),
                    children: []
                });
            }
        } else {
            if (arr[i][1]) {
                counter2nd++;
                type2nd = arr[i][1];
                careerArray[counter1st].children.push({//create 2nd level code
                    text: type2nd,
                    code: formatCode(counter1st) + formatCode(counter2nd),
                    children: []
                });
            }
        }
        careerArray[counter1st].children[counter2nd].children.push({
            text: arr[i][3],
            code: arr[i][2],
            lvl: arr[i][4],
        });
    }
    return JSON.stringify(careerArray, null, "    ");
}

function formatCode(num) {
    if (num < 10) return "0" + num;
    return "" + num;
}
