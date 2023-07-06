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

const getHeight = (playField: any) => {
    const ys = Object.keys(playField).sort((a, b) => Number(b) - Number(a));
    for (let i = 0; i < ys.length; i++) {
        const y = ys[i];
        const row = Object.values(playField[y]);
        if (row.includes('#')) {
            return Number(y);
        }
    }
    return 0;
};

const getTop = (playField: any) => {
    const ys = Object.keys(playField).sort((a, b) => Number(b) - Number(a));
    const counter = Array(7);
    let found;
    for (let i = 0; i < ys.length; i++) {
        const y = ys[i];
        for (let j = 0; j < 10; j++) {
            if (playField[y][j] === '#') {
                if (found === undefined) {
                    found = i;
                }
                if (counter[j] === undefined) {
                    counter[j] = i - found;
                }
            }
        }
    }
    return counter.join('');
};

const dict: {
    [key: number]: any;
} = {};

const findPattern = (gusts: number[]) => {
    const memo: any = Array(blocks.length)
        .fill({})
        .reduce((acc: any, _, i: number) => {
            acc[i] = {};
            return acc;
        }, {});
    const numberOfBlocks = 100000;
    let height = 0;
    let playField: any = { 0: { 0: '#', 1: '#', 2: '#', 3: '#', 4: '#', 5: '#', 6: '#' } };
    let currentBlock = 0;
    let gIndex: number = 0;

    let firstPattern;
    let firstPatternIndex;
    let firstPatternHeight;
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
                height = getHeight(playField);

                const top = getTop(playField);
                if (memo[currentBlock][top] && memo[currentBlock][top].gIndex === gIndex) {
                    if (firstPattern === undefined) {
                        firstPattern = top;
                        firstPatternHeight = height;
                        firstPatternIndex = i;
                        dict[i] = height;
                        console.log('first pattern', i, height);
                    } else if (firstPattern === top) {
                        console.log('found pattern', i);
                        console.log('height', height);
                        console.log(memo[currentBlock][top]);
                        return {
                            startIndex: memo[currentBlock][top].index,
                            startHeight: memo[currentBlock][top].height, // @ts-ignore
                            height: height - firstPatternHeight, // @ts-ignore
                            numBlocks: i - firstPatternIndex,
                        };
                    }
                } else {
                    memo[currentBlock][top] = {
                        gIndex,
                        height,
                        index: i,
                    };
                    dict[i] = height;
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
    return {
        height: 0,
        numBlocks: 0,
    };
};

const run = (gusts: Array<number>) => {
    const numberOfBlocks = 1000000000000;

    const repeat = findPattern(gusts);
    console.log(repeat);
    const blocksLeft = numberOfBlocks - repeat.startIndex;
    const iters = Math.floor(blocksLeft / repeat.numBlocks);
    let repeatHeight = iters * repeat.height;
    const mod = numberOfBlocks - iters * repeat.numBlocks - repeat.startIndex;
    console.log(mod);
    const next = repeat.startIndex + mod;

    const leftOver = dict[next - 1] - repeat.startHeight;
    console.log(leftOver);

    const height = repeatHeight + leftOver + repeat.startHeight;
    console.log(height);
};

export {};
