const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data
        .trim()
        .split('\n')
        .map((line: string) => {
            return line.split(',').map((el: string) => parseInt(el, 10));
        });

    run(lines);
});

const run = (lines: number[][]) => {
    const particles = Array(lines.length).fill(6);
    for (let i = 0; i < lines.length; i++) {
        const element = lines[i];
        for (let j = i + 1; j < lines.length; j++) {
            const otherEl = lines[j];
            let contacts = 0;
            let diff;
            if (element[0] === otherEl[0]) contacts++;
            else diff = Math.abs(element[0] - otherEl[0]);
            if (element[1] === otherEl[1]) contacts++;
            else diff = Math.abs(element[1] - otherEl[1]);
            if (element[2] === otherEl[2]) contacts++;
            else diff = Math.abs(element[2] - otherEl[2]);
            if (contacts === 2 && diff === 1) {
                particles[i]--;
                particles[j]--;
            }
        }
    }
    const surfaceArea = particles.reduce((acc: number, el: number) => acc + el, 0);
    console.log(surfaceArea);
};

export {};
