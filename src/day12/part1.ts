const fs = require('fs');
const path = require('path');

type Visited = {
    [key: number]: {
        [key: number]: number;
    };
};

let map: number[][];
fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data.trim().split('\n');
    map = format(lines);
    run();
});

let start: [number, number] = [0, 0];
const visited: Visited = {};

const format = (lines: string[]) => {
    const final = lines.map((line, i) => {
        return line.split('').map((char, j) => {
            if (char === 'S') {
                start = [i, j];
                return 2;
            }
            if (char === 'E') {
                return 28;
            }
            return char.charCodeAt(0) - 95;
        });
    });
    return final;
};

const recur = (l: [number, number], soFar: number) => {
    const [y, x] = l;

    if (!map[y] || !map[y][x]) {
        return Infinity;
    }

    if (visited[y]) {
        if (visited[y][x] && visited[y][x] <= soFar) {
            return Infinity;
        }
        visited[y][x] = soFar;
    } else {
        visited[y] = {
            [x]: soFar,
        };
    }

    let current = map[y][x];
    if (current === 28) {
        return 0;
    }

    let numsToGo = Infinity;
    const up = map[y - 1] && map[y - 1][x];
    const down = map[y + 1] && map[y + 1][x];
    const right = map[y] && map[y][x + 1];
    const left = map[y] && map[y][x - 1];

    if (up <= current + 1) {
        const dUP = recur([y - 1, x], soFar + 1);
        if (dUP < numsToGo) {
            numsToGo = dUP;
        }
    }
    if (down <= current + 1) {
        const dDown = recur([y + 1, x], soFar + 1);
        if (dDown < numsToGo) {
            numsToGo = dDown;
        }
    }
    if (right <= current + 1) {
        const dRigth = recur([y, x + 1], soFar + 1);
        if (dRigth < numsToGo) {
            numsToGo = dRigth;
        }
    }
    if (left <= current + 1) {
        const distance = recur([y, x - 1], soFar + 1);
        if (distance < numsToGo) {
            numsToGo = distance;
        }
    }
    return numsToGo + 1;
};

const run = () => {
    const distances = [];
    for (let i = 0; i < map.length; i++) {
        const row = map[i];
        for (let j = 0; j < row.length; j++) {
            const char = row[j];
            if (char === 2) {
                distances.push(recur([i, j], 0));
            }
        }
    }
    console.log(Math.min(...distances));
};

export {};
