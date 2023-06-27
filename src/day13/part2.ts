const fs = require('fs');
const path = require('path');

const EQUAL = 'equal';

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data
        .trim()
        .split('\n\n')
        .reduce(
            (a: any, line: string) => {
                const [left, right] = line.split('\n');
                a.push(eval(left));
                a.push(eval(right));
                return a;
            },
            [[[2]], [[6]]],
        );
    run(lines);
});

const compare = (a: any, b: any): boolean | string => {
    if (typeof a === 'object' && typeof b === 'object') {
        for (let i = 0; i < a.length; i++) {
            if (b[i] == undefined) return false; // this line took me forever to debug it was !b[i] which would fail on 0... booo

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
    const sorted = lines.sort((a: any, b: any) => {
        const res = compare(a, b);
        if (res === EQUAL) return 0;
        return res ? -1 : 1;
    });
    const strings = sorted.map((line: any) => JSON.stringify(line));
    const d1 = strings.indexOf('[[2]]') + 1;
    const d2 = strings.indexOf('[[6]]') + 1;
    console.log(d1, d2);
    console.log(d1 * d2);
};

export {};
