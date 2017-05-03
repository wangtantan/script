"use strict";

const async = require('async');
const csv = require('csv');
const co = require('co');
const fs = require('fs');
const iconv = require('iconv-lite')
const Excel = require('exceljs');

let files = ['FDSMjob'];
//getNewJobArr([, , null, "rr" ,"r", ]);
for (let file of files) {
    run(file);
}

function run(file) {
    mySeries({
        data: (_cb) => {
            console.log("start");
            fs.readFile(`./data/${file}.csv`, _cb);
        },
        csv: (_cb, ret) => {
            console.log("=====================");
            csv.parse(iconv.decode(ret.data, 'gb2312'), (err, arr) => {
                if (err) return _cb(err);
                let newArr = arr.map((jobArr) => {
                    let newJobArr = getNewJobArr(jobArr);
                    return newJobArr;
                });
                console.log(newArr);
                //process.exit(0);
                _cb(null, newArr);
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

function getNewJobArr(arr) {
    let newArr = new Array(7);
    let index = 6;
    while (arr.length > 0) {
        let ele = arr.pop();
        if (ele) {
            newArr[index--] = ele;
        };
    };
    console.log(newArr);
    return newArr;
};

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
    for (let i = 3; i < arr.length; i++) {
        console.log({i, arr: arr[i]});
        if (arr[i][0]) {
            counter1st++;
            type1st = arr[i][0];
            careerArray.push({//create 1st level code
                text: type1st.substr(0, type1st.length-2),
                code: type1st.substr(type1st.length - 2),
                children: []
            });
            if (arr[i][1]) {
                counter2nd = 0;
                type2nd = arr[i][1];
                careerArray[counter1st].children.push({//create 2nd level code
                    text: type2nd.substr(0, type2nd.length - 3),
                    code: type2nd.substr(type2nd.length - 3),
                    children: []
                });
            }
        } else {
            if (arr[i][1]) {
                counter2nd++;
                type2nd = arr[i][1];
                careerArray[counter1st].children.push({//create 2nd level code
                    text: type2nd.substr(0, type2nd.length - 3),
                    code: type2nd.substr(type2nd.length - 3),
                    children: []
                });
            }
        }
        if (arr[i][2] && arr[i][3]) {
            careerArray[counter1st].children[counter2nd].children.push({
                text: arr[i][2],
                code: arr[i][3] ? (("" + arr[i][3]).length == 6 ? arr[i][3] : "0" + arr[i][3]) : undefined,
                lvl: arr[i][5],//意外险arr[i][4]，人寿险arr[i][5]
            });
        }
    }
    return JSON.stringify(careerArray, null, "    ");
}

function formatCode(num) {
    if (num < 10) return "0" + num;
    return "" + num;
}
