'use strict'

function getRange(age) {
    if (age <= 20) return parseInt((age - 1) / 5) + 21;
    if (age >= 66) return parseInt((age - 1) / 5) + 12;
    return parseInt((age - 1) / 5) + 8;
}

let map = {};
for (let i = 0; i <= 80; i++) {
    let type = "" + getRange(i);
    map[type] ? null : map[type] = [];
    map[type].push(i);
    //console.log({i, type: getRange(i)});
}
console.log(map);

