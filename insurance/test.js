"use strict"

let aArray = [1, 5, 6, 7, 8, 10, 21, 55, 100];
let bArray = [0, 5, 7, 8, 9, 10];
let num = 0;

let arr = [1, 2, 3, 4,6];
shiftMode(arr);
console.log(arr);


console.log(findMiddle(aArray, bArray));

function findMiddle(array1, array2){
    let l1 = array1.length;
    let l2 = array2.length;
    let m1 = {min: array1[Math.floor((l1 - 2) / 2)], middle: array1[(l1 - 1) / 2], max: array1[Math.ceil(l1 / 2)]};
    let m2 = {min: array2[Math.floor((l2 - 2) / 2)], middle: array2[(l2 - 1) / 2], max: array2[Math.ceil(l2 / 2)]};
    console.log(m1);
    console.log(m2);
    //return 0;
    //process.exit(0);

    let mode = shiftMode(m1, m2);
    console.log(num++, ":");
    console.log({array1, l1, m1, array2, l2, m2});
    if (array1.length == 1) {
        almostFinash(array1, array2);
    }


    if (array1.length > array2.length) {
        findMiddle(array2, array1);
    }
    let v1 = array1[m1];
    let v2 = array2[m2];
    if (v1 == v2) {
        return v1;
    } else if (v1 < v2) {
        return findMiddle(array1.slice(m1), array1.slice(0, (l2 - m1)));
    } else if (v1 > v2) {
        return findMiddle(array1.slice(0, m1), array2.slice(m1));
    }
};

function almostFinash(array1, array2) {
    let l1 = array1.length;
    let l2 = array2.length;
    if (l2 == 1) return (array1[0] + array2[0]) / 2;
    if (parseInt(l2 / 2) != l2 /2) {
        almostFinash();
    } 
}

function shiftMode(a, b) {
    let aa = a.min,
        ab = a.max,
        ba = b.min,
        bb = b.max;
    if 
};
