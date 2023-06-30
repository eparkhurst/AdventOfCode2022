const fs = require('fs');
const path = require('path');

type Formatted = {
    s: number[];
    b: number[];
}[];

const checkLn = 2000000;

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data.trim().split('\n');
    run(lines);
});

const format = (lines: string[]): Formatted => {
    return lines.map((line) => {
        const [s, b] = line.replace('Sensor at ', '').replace(' closest beacon is at ', '').split(':');
        const sx = s.split(',')[0].split('=')[1];
        const sy = s.split(',')[1].split('=')[1];
        const bx = b.split(',')[0].split('=')[1];
        const by = b.split(',')[1].split('=')[1];
        return {
            s: [Number(sx), Number(sy)],
            b: [Number(bx), Number(by)],
        };
    });
};

const fillMap = (map: any, s: number[], m: number) => {
    const [sx, sy] = s;

    for (let i = sy - m; i < sy + m; i++) {
        if (i !== checkLn) continue;
        const xDiff = m - Math.abs(sy - i);
        for (let j = sx - xDiff; j <= sx + xDiff; j++) {
            if (map[i]) {
                if (!map[i][j]) map[i][j] = '#';
            } else {
                map[i] = {
                    [j]: '#',
                };
            }
        }
    }
    return map;
};

const generateMap = (formatted: Formatted) => {
    const map: any = {};
    for (let i = 0; i < formatted.length; i++) {
        const { s, b } = formatted[i];
        const [sx, sy] = s;
        const [bx, by] = b;
        if (map[sy]) {
            map[sy][sx] = 'S';
        } else {
            map[sy] = {
                [sx]: 'S',
            };
        }
        if (map[by]) {
            map[by][bx] = 'B';
        } else {
            map[by] = {
                [bx]: 'B',
            };
        }
        const manhattan = Math.abs(sx - bx) + Math.abs(sy - by);
        if (sy + manhattan > checkLn && sy - manhattan < checkLn) {
            fillMap(map, s, manhattan);
        }
    }
    return map;
};

const run = (lines: string[]) => {
    const formatted = format(lines);
    const map = generateMap(formatted);

    const hashes = Object.values(map[checkLn]).filter((s) => s !== 'B');
    console.log(hashes.length);
};

export {};
