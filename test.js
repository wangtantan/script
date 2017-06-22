"use strict";

const fs = require('fs');
let contentText = fs.readFileSync('/Users/sogu2016/tanScript/jobCode/CCRS/data/CCRSjob.csv', 'utf-8');

let s = 0;
let calback = (action) => {
    let str = fs.readFileSync('/Users/sogu2016/tanScript/jobCode/CCRS/data/CCRSjob.csv', 'utf-8') + s++;
    return (content) => {
        let out = action + ":\t" + str.length + ":\t" + content;
        //console.log(out);
    }
}


//let content = contentText;
//console.log(content.length);
//console.log(content);

let i = 0;
while (true) {
    //calback("say")(str);
    //console.log(i +"\t:" + str.length);
    calback("say ")(i++);
}
