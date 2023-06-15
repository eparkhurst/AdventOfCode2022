const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    run(data.trim().split('\n'));
});

const run = (lines: string[]) => {
    const treeMap = lines.map((line: string) =>
        line.split('').map((height: string) => {
            return {
                height,
                visible: null,
            };
        }),
    );
    let max = 0;
    for (let i = 0; i < treeMap.length; i++) {
        for (let j = 0; j < treeMap[i].length; j++) {
            const view = checkVisible(treeMap, j, i);
            if (view > max) {
                max = view;
            }
        }
    }
    console.log(max);
};

const checkVisible = (treeMap: any, x: number, y: number) => {
    const tree = treeMap[y][x];

    let left = 0;
    let right = 0;
    let up = 0;
    let down = 0;

    //check left
    if (x !== 0) {
        for (let i = x - 1; i >= 0; i--) {
            if (x === 1 && y === 2) console.log(i);
            const element = treeMap[y][i];
            left++;
            if (element.height >= tree.height) {
                break;
            }
        }
    }
    // check right
    if (x !== treeMap[y].length - 1) {
        for (let i = x + 1; i < treeMap[y].length; i++) {
            const element = treeMap[y][i];
            right++;
            if (element.height >= tree.height) {
                break;
            }
        }
    }

    // checkUP
    if (y !== 0) {
        for (let i = y - 1; i >= 0; i--) {
            const element = treeMap[i];
            up++;
            if (element[x].height >= tree.height) {
                break;
            }
        }
    }
    // check down
    if (y !== treeMap.length - 1) {
        for (let i = y + 1; i < treeMap.length; i++) {
            const element = treeMap[i];
            down++;
            if (element[x].height >= tree.height) {
                break;
            }
        }
    }
    tree.visible = `${up} ${down} ${left} ${right}`;

    return up * down * left * right;
};

export {};

// 65518 too low
