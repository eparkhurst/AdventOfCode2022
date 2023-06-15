const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    run(data.trim().split('\n'));
});

const run = (lines: string[]) => {
    let final = 0;
    let cycles = 0;
    let x = 1;
    for (let i = 0; i < lines.length; i++) {
        const element = lines[i];
        const arr = element.split(' ');
        if (arr[0] == 'noop') {
            cycles++;
            if (cycles == 20 || (cycles - 20) % 40 === 0) {
                final += cycles * x;
            }
        } else if (arr[0] == 'addx') {
            cycles++;
            if (cycles == 20 || (cycles - 20) % 40 === 0) {
                final += cycles * x;
            }
            cycles++;
            if (cycles == 20 || (cycles - 20) % 40 === 0) {
                final += cycles * x;
            }
            x += Number(arr[1]);
        }
    }
    console.log(final);
};

export {};
