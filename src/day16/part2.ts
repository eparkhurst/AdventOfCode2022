const fs = require('fs');
const path = require('path');

const EQUAL = 'equal';

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data.trim().split('\n');
    run(lines);
});

const run = (lines: string[]) => {
    console.log('run');
};

export {};
