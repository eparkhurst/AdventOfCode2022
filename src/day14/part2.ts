const fs = require('fs');
const path = require('path');

const EQUAL = 'equal';

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data.trim().split('\n');
    run(lines);
});

const generateMap = (lines: string[]) => {
    const map: any = {};
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const points = line.split('->').map((s) => s.trim());
        for (let j = 0; j < points.length; j++) {
            const point = points[j];
            const [x, y] = point.split(',').map((s) => Number(s.trim()));
            if (map[y]) {
                map[y][x] = '#';
            } else {
                map[y] = {
                    [x]: '#',
                };
            }
            if (points[j + 1]) {
                const [x2, y2] = points[j + 1].split(',').map((s) => Number(s.trim()));
                if (y === y2) {
                    const start = x < x2 ? x : x2;
                    const end = x > x2 ? x : x2;
                    for (let k = start; k <= end; k++) {
                        map[y][k] = '#';
                    }
                } else {
                    const start = y < y2 ? y : y2;
                    const end = y > y2 ? y : y2;
                    for (let k = start; k <= end; k++) {
                        if (map[k]) {
                            map[k][x] = '#';
                        } else {
                            map[k] = {
                                [x]: '#',
                            };
                        }
                    }
                }
            }
        }
    }
    return map;
};

const addSand = (map: any) => {
    const maxY = Math.max(...Object.keys(map).map((s) => Number(s)));
    const floor = maxY + 2;
    let sand = [0, 500];
    let count = 0;
    map[0] = {};
    while (!map[0][500]) {
        if (!map[sand[0] + 1]) {
            map[sand[0] + 1] = {};
        }
        if (sand[0] + 1 === floor) {
            count++;
            map[sand[0]][sand[1]] = 'O';
            sand = [0, 500];
        } else if (!map[sand[0] + 1][sand[1]]) {
            sand = [sand[0] + 1, sand[1]];
        } else if (!map[sand[0] + 1][sand[1] - 1]) {
            sand = [sand[0] + 1, sand[1] - 1];
        } else if (!map[sand[0] + 1][sand[1] + 1]) {
            sand = [sand[0] + 1, sand[1] + 1];
        } else {
            count++;
            map[sand[0]][sand[1]] = 'O';
            sand = [0, 500];
        }
    }
    return count;
};

const run = (lines: string[]) => {
    const map = generateMap(lines);
    const final = addSand(map);
    console.log(final);
};

export {};
