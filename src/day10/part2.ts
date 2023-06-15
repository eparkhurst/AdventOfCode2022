const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    run(data.trim().split('\n'));
});

const run = (lines: string[]) => {
    let cycles = 0;
    let x = 1;
    const crt: string[] = [];
    for (let i = 0; i < lines.length; i++) {
        const element = lines[i];
        const arr = element.split(' ');
        if (cycles >= 40) cycles = 0;
        if (arr[0] == 'noop') {
            if (cycles === x || cycles === x + 1 || cycles === x - 1) {
                crt.push('#');
            } else {
                crt.push('.');
            }
            cycles++;
            if (cycles >= 40) cycles = 0;
        } else if (arr[0] == 'addx') {
            if (cycles === x || cycles === x + 1 || cycles === x - 1) {
                crt.push('#');
            } else {
                crt.push('.');
            }
            cycles++;
            if (cycles >= 40) cycles = 0;
            if (cycles === x || cycles === x + 1 || cycles === x - 1) {
                crt.push('#');
            } else {
                crt.push('.');
            }
            cycles++;
            if (cycles >= 40) cycles = 0;
            x += Number(arr[1]);
        }
    }
    const image = [
        crt.slice(0, 40),
        crt.slice(40, 80),
        crt.slice(80, 120),
        crt.slice(120, 160),
        crt.slice(160, 200),
        crt.slice(200, 240),
    ];
    console.log(image.map((row) => row.join('')).join('\n'));
};

export {};
