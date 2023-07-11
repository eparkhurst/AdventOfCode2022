const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data.trim().split('\n');

    run(lines);
});

const run = (input: any[]) => {
    const len = input.length;
    const dict: any = {};
    const repeats: any = {};
    let coords = [...input].map((el) => Number(el));
    for (let i = 0; i < 3000; i++) {
        if (dict[coords[i]]) {
            repeats[i] = i;
        } else {
            dict[coords[i]] = true;
        }
    }
    for (let i = 0; i < coords.length; i++) {
        const coord = Number(input[i]);

        const index = repeats[i] ? repeats[i] : coords.indexOf(coord);
        coords.splice(index, 1);
        let nextIndex = index + coord;
        if (nextIndex <= 0) {
            nextIndex = (nextIndex % (len - 1)) + (len - 1);
        } else if (nextIndex >= len) {
            nextIndex = nextIndex % (len - 1);
        }

        for (const repeat in repeats) {
            if (repeats[repeat] >= nextIndex) {
                repeats[repeat] += 1;
            } else {
                repeats[repeat] -= 1;
            }
        }
        coords.splice(nextIndex, 0, coord);
    }

    const index0 = coords.indexOf(0);
    const mod1000 = 1000 % len;
    const mod2000 = 2000 % len;
    const mod3000 = 3000 % len;
    const index1000 = (mod1000 + index0) % len;
    const index2000 = (mod2000 + index0) % len;
    const index3000 = (mod3000 + index0) % len;
    console.log(coords[index1000], coords[index2000], coords[index3000]);
    const final = coords[index1000] + coords[index2000] + coords[index3000];
    console.log(coords);
    console.log(final);

    // console.log('repeat length', repeats.length);
};
// -13327 is wrong
export {};
