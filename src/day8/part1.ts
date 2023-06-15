const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    run(data.trim().split('\n'));
});
let raw: string[];
const run = (lines: string[]) => {
    raw = lines;

    const treeMap = lines.map((line: string) =>
        line.split('').map((height: string) => {
            return {
                height,
                visible: null,
            };
        }),
    );
    let total = 0;
    for (let i = 0; i < treeMap.length; i++) {
        for (let j = 0; j < treeMap[i].length; j++) {
            if (checkVisible(treeMap, j, i)) {
                total++;
            }
        }
    }
    console.log(total);
};

const checkVisible = (treeMap: any, x: number, y: number) => {
    const yMaX = treeMap.length - 1;
    const xMax = treeMap[0].length - 1;
    const tree = treeMap[y][x];
    if (x === 0 || y === 0 || x === xMax || y === yMaX) {
        tree.visible = true;
        return true;
    }

    //check horizontal
    const line = raw[y];
    const first = line
        .slice(0, x)
        .split('')
        .map((num) => Number(num));
    const second = line
        .slice(x + 1)
        .split('')
        .map((num) => Number(num));

    if (Math.max(...first) < Number(tree.height) || Math.max(...second) < Number(tree.height)) {
        tree.visible = true;
        return true;
    }
    // checkVertical
    for (let i = y + 1; i < treeMap.length; i++) {
        const element = treeMap[i];
        if (element[x].height >= tree.height) {
            break;
        }
        if (i === treeMap.length - 1) {
            tree.visible = true;
            return true;
        }
    }
    for (let i = 0; i < y; i++) {
        const element = treeMap[i];
        if (element[x].height >= tree.height) {
            break;
        }
        if (i === y - 1) {
            tree.visible = true;
            return true;
        }
    }
    tree.visible = false;
    return false;
};

export {};

// 1109 too low
// 1186 too low
