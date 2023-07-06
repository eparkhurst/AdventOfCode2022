const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data
        .trim()
        .split('')
        .map((gust: string) => {
            return gust === '<' ? -1 : 1;
        });
    run(lines);
});

const blocks = [
    [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
    ],
    [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 1],
    ],
    [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1],
        [2, 2],
    ],
    [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
    ],
    [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
    ],
];

const placeInitialBlock = (block: any, height: number) => {
    for (let i = 0; i < block.length; i++) {
        block[i][1] = block[i][1] + height;
        block[i][0] = block[i][0] + 2;
    }
};

const checkGust = (block: any, playField: any, gust: number) => {
    for (let i = 0; i < block.length; i++) {
        const [x, y] = block[i];
        if (!playField[y]) {
            playField[y] = { 0: '.', 1: '.', 2: '.', 3: '.', 4: '.', 5: '.', 6: '.' };
        }
        // check if block can move over
        if (!playField[y][Number(x) + gust] || playField[y][Number(x) + gust] === '#') {
            return false;
        }
    }

    return true;
};
const checkDown = (block: any, playField: any) => {
    for (let i = 0; i < block.length; i++) {
        const [x, y] = block[i];
        if (!playField[y - 1]) {
            playField[y - 1] = { 0: '.', 1: '.', 2: '.', 3: '.', 4: '.', 5: '.', 6: '.' };
        }
        // check if block can move down
        if (!playField[Number(y) - 1][x] || playField[Number(y) - 1][x] === '#') {
            return false;
        }
    }

    return true;
};

const moveBlock = (block: any, yChange: number, xChange: number) => {
    for (let i = 0; i < block.length; i++) {
        const [x, y] = block[i];
        block[i][0] = Number(x) + xChange;
        block[i][1] = Number(y) + yChange;
    }
};

const run = (gusts: Array<number>) => {
    const numberOfBlocks = 2022;
    let height = 0;
    let playField: any = { 0: { 0: '#', 1: '#', 2: '#', 3: '#', 4: '#', 5: '#', 6: '#' } };
    let currentBlock = 0;
    let gIndex: number = 0;
    for (let i = 0; i < numberOfBlocks; i++) {
        let blockStopped = false;
        const block = JSON.parse(JSON.stringify(blocks[currentBlock]));
        placeInitialBlock(block, height + 4);

        while (!blockStopped) {
            const gust = gusts[gIndex];
            const canMoveGust = checkGust(block, playField, gust);
            if (canMoveGust) {
                moveBlock(block, 0, gust);
            }
            const canMoveDown = checkDown(block, playField);
            if (!canMoveDown) {
                for (let i = 0; i < block.length; i++) {
                    const [x, y] = block[i];
                    playField[y][x] = '#';
                }
                const ys = Object.keys(playField).sort((a, b) => Number(b) - Number(a));
                for (let i = 0; i < ys.length; i++) {
                    const y = ys[i];
                    const row = Object.values(playField[y]);
                    if (row.includes('#')) {
                        height = Number(y);
                        break;
                    }
                }
                blockStopped = true;
            } else {
                moveBlock(block, canMoveDown ? -1 : 0, 0);
            }
            if (gIndex < gusts.length - 1) {
                gIndex++;
            } else {
                gIndex = 0;
            }
        }

        if (currentBlock < blocks.length - 1) {
            currentBlock++;
        } else {
            currentBlock = 0;
        }
    }
    // printState(playField);
    console.log(height);
};

const printState = (playField: any) => {
    const pretty: string[] = [];
    for (const line in playField) {
        if (line === '0') {
            pretty.unshift('-------');
        } else {
            pretty.unshift(Object.values(playField[line]).join(''));
        }
    }
    console.log(pretty.join('\n'));
    console.log('\n');
};

export {};
