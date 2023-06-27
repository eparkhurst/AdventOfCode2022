const fs = require('fs');
const path = require('path');

const EQUAL = 'equal';

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data.trim().split('\n\n');
    run(lines);
});

const compare = (a: any, b: any): boolean | string => {
    if (typeof a === 'object' && typeof b === 'object') {
        for (let i = 0; i < a.length; i++) {
            // this next line took me forever to debug it was checking !b[i] and was failing for 0... booo
            if (b[i] == undefined) return false;
            const res = compare(a[i], b[i]);
            if (res === EQUAL) continue;
            return res;
        }
        return a.length === b.length ? EQUAL : true;
    } else if (typeof b === 'object') {
        return compare([a], b);
    } else if (typeof a === 'object') {
        return compare(a, [b]);
    }
    return a === b ? EQUAL : a < b;
};

const run = (lines: string[]) => {
    let count = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const [left, right] = line.split('\n');
        if (compare(eval(left), eval(right))) {
            const idex = i + 1;
            count += idex;
        }
    }
    console.log(count);
};

export {};
// 5934 too low
// 5975 too low
// 6013 too low
// 6399 wrong
