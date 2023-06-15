const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    run(data.trim().split('\n'));
});

const previousPositions: any = {};
let total = 0;
const run = (lines: string[]) => {
    const map = {
        h: {
            x: 0,
            y: 0,
        },
        t: {
            x: 0,
            y: 0,
        },
    };
    for (let i = 0; i < lines.length; i++) {
        const [dir, amount] = lines[i].split(' ');
        adjustMap(dir, Number(amount), map);
    }
    console.log(total);
};

const adjustMap = (dir: string, amount: number, map: any) => {
    for (let i = 0; i < amount; i++) {
        if (dir === 'U') {
            map.h.y++;
            //adjust tail
            if (map.t.y + 1 < map.h.y) {
                map.t.y++;
                if (map.t.x !== map.h.x) {
                    map.t.x = map.h.x;
                }
            }
        } else if (dir === 'D') {
            map.h.y--;
            //adjust tail
            if (map.t.y - 1 > map.h.y) {
                map.t.y--;
                if (map.t.x !== map.h.x) {
                    map.t.x = map.h.x;
                }
            }
        }
        if (dir === 'L') {
            map.h.x--;
            if (map.t.x - 1 > map.h.x) {
                map.t.x--;
                if (map.t.y !== map.h.y) {
                    map.t.y = map.h.y;
                }
            }
        }
        if (dir === 'R') {
            map.h.x++;
            if (map.t.x + 1 < map.h.x) {
                map.t.x++;
                if (map.t.y !== map.h.y) {
                    map.t.y = map.h.y;
                }
            }
        }
        if (!previousPositions[map.t.x]) {
            total++;
            previousPositions[map.t.x] = {
                [map.t.y]: true,
            };
        } else {
            if (!previousPositions[map.t.x][map.t.y]) {
                total++;
                previousPositions[map.t.x][map.t.y] = true;
            }
        }
    }
};

export {};
