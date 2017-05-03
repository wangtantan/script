"use strict";

const async = require('async');
const csv = require('csv');
const fs = require('fs');
const iconv = require('iconv-lite')

let files = ['CCRSjob'];
//let files = ['career'];

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
                for (let i = 0; i < 3; i++) {
                    console.log(i, arr[i][0].substr(5, 1));
                    console.log(i, arr[i][0].substr(6));
                }
//                process.exit(0);
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
    let code1st = "",
        code2nd = "";
    let type1st = "",
        type2nd = "";
    for (let i = 2; i < arr.length; i++) {
    //for (let i = 2; i < 30; i++) {
        console.log({i, arr: arr[i]});
        if (arr[i][0] && arr[i][0] != type1st) {
            type1st = arr[i][0];
            counter1st++;
            careerArray.push({//create 1st level code
                text: type1st.substr(6),
                code: type1st.substr(5, 1),
                children: []
            });
            if (arr[i][1] && arr[i][1] != type2nd) {
                type2nd = arr[i][1];
                counter2nd = 0;
                careerArray[counter1st].children.push({//create 2nd level code
                    text: type2nd.substr(3),
                    code: type2nd.substr(0, 3),
                    children: []
                });
            }
        } else {
            if (arr[i][1] && arr[i][1] != type2nd) {
                type2nd = arr[i][1];
                counter2nd++;
                careerArray[counter1st].children.push({//create 2nd level code
                    text: type2nd.substr(3),
                    code: type2nd.substr(0, 3),
                    children: []
                });
            }
        }
        careerArray[counter1st].children[counter2nd].children.push({
            text: arr[i][3].substr(7),
            code: arr[i][3].substr(0, 7),
            lvl: arr[i][5],
        });
    }
    return JSON.stringify(careerArray, null, "    ");
}

function formatCode(num) {
    if (num < 10) return "0" + num;
    return "" + num;
}
