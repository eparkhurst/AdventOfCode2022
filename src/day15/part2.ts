const fs = require('fs');
const path = require('path');

type Formatted = {
    s: number[];
    b: number[];
}[];
type Map = {
    [y: number]: [[number, number]];
};

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

const checkLn = 20;
// const checkLn = 4000000;

const fillMap = (map: Map, s: number[], m: number) => {
    const [sx, sy] = s;

    for (let i = sy - m; i < sy + m; i++) {
        if (i < 0) continue;
        if (i > checkLn) break;

        const xDiff = m - Math.abs(sy - i);
        if (xDiff < 0) console.log('problem');
        const min = sx - xDiff;
        const max = sx + xDiff;

        const yArray = map[i];
        if (yArray) {
            for (let j = 0; j < yArray.length; j++) {
                if (yArray[j][1] < min) {
                    yArray.push([min, max]);
                    continue;
                }
                if (yArray[j][0] > min) yArray[j][0] = min;
                if (yArray[j][1] < max) yArray[j][1] = max;
            }
        } else {
            map[i] = [[min, max]];
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
        const manhattan = Math.abs(sx - bx) + Math.abs(sy - by);
        fillMap(map, s, manhattan);
    }
    return map;
};

const run = (lines: string[]) => {
    const formatted = format(lines);
    const map = generateMap(formatted);
    console.log('map made', Object.keys(map).length);
    let count = 0;
    let go = true;
    for (const y in map) {
        const arr = map[y];
        if (arr.length <= 1) continue;
        if (arr[0][1] > checkLn && arr[0][0] < 0) continue;

        const exists = arr.find((a: any) => a[0] <= 0 && a[1] >= checkLn);
        if (exists) continue;
        count++;
        if (go) {
            console.log(arr);
            go = false;
        }
        const reducedArr = arr.reduce((acc: any, cur: any, index: number) => {
            if (index === 0) {
                acc.push(cur);
                return acc;
            }
            const cMin = cur[0];
            const cMax = cur[1];
            if (cMin <= acc[0][1] + 1) {
                map[y][0][0] = Math.min(cMin, map[y][0][0]);
                map[y][0][1] = Math.max(cMax, map[y][0][1]);
            } else {
                acc.push(cur);
            }
            return acc;
        }, []);
        if (reducedArr[0][0] > 0 || reducedArr[0][1] < checkLn) {
            console.log('y', y, 'x', reducedArr[0][1] + 1);
        }
    }
    console.log(count);
    console.log('done');
};

export {};
