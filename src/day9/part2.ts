const fs = require('fs');
const path = require('path');

type Node = {
    x: number;
    y: number;
};
fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    run(data.trim().split('\n'));
});

const previousPositions: any = {};
let total = 0;

const run = (lines: string[]) => {
    const map = [];
    for (let i = 0; i < 10; i++) {
        map.push({ x: 0, y: 0 });
    }
    for (let i = 0; i < lines.length; i++) {
        const [dir, amount] = lines[i].split(' ');
        adjustMap(dir, Number(amount), map);
    }
    console.log(total);
};

const adjustMap = (dir: string, amount: number, map: Node[]) => {
    for (let i = 0; i < amount; i++) {
        if (dir === 'U') {
            map[0].y++;
        } else if (dir === 'D') {
            map[0].y--;
        }
        if (dir === 'L') {
            map[0].x--;
        }
        if (dir === 'R') {
            map[0].x++;
        }
        for (let j = 1; j < map.length; j++) {
            // if (dir === 'U' && i === 3) {
            //     console.log(map);
            // }
            const element = map[j];
            adjustNode(map[j - 1], element);

            if (j === map.length - 1) {
                if (!previousPositions[element.x]) {
                    total++;
                    previousPositions[element.x] = {
                        [element.y]: true,
                    };
                } else if (!previousPositions[element.x][element.y]) {
                    total++;
                    previousPositions[element.x][element.y] = true;
                }
            }
        }
        // console.log(map);
    }
};

const adjustNode = (head: Node, tail: Node) => {
    if (head.x > tail.x + 1) {
        tail.x++;
        if (head.y > tail.y + 1) {
            tail.y++;
        } else if (head.y < tail.y - 1) {
            tail.y--;
        } else {
            tail.y = head.y;
        }
    }
    if (head.x < tail.x - 1) {
        tail.x--;
        if (head.y > tail.y + 1) {
            tail.y++;
        } else if (head.y < tail.y - 1) {
            tail.y--;
        } else {
            tail.y = head.y;
        }
    }
    if (head.y > tail.y + 1) {
        tail.y++;
        if (head.x > tail.x + 1) {
            tail.x++;
        } else if (head.x < tail.x - 1) {
            tail.x--;
        } else {
            tail.x = head.x;
        }
    } else if (head.y < tail.y - 1) {
        tail.y--;
        if (head.x > tail.x + 1) {
            tail.x++;
        } else if (head.x < tail.x - 1) {
            tail.x--;
        } else {
            tail.x = head.x;
        }
    }
};

export {};

//2567 too high
// 2523 too high
