const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data
        .trim()
        .split('\n')
        .map((line: string) => {
            return line.split(',').map((el: string) => parseInt(el, 10));
        });

    run(lines);
});
const dict: any = {};
const getSurfaceArea = (lines: number[][]) => {
    const particles = Array(lines.length).fill(6);
    for (let i = 0; i < lines.length; i++) {
        const [x, y, z] = lines[i];
        if (dict[`${x},${y},${z}`]) {
            console.log('duplicate');
        } else {
            dict[`${x},${y},${z}`] = true;
        }
        for (let j = i + 1; j < lines.length; j++) {
            const otherEl = lines[j];
            let contacts = 0;
            let diff;
            if (x === otherEl[0]) contacts++;
            else diff = Math.abs(x - otherEl[0]);
            if (y === otherEl[1]) contacts++;
            else diff = Math.abs(y - otherEl[1]);
            if (z === otherEl[2]) contacts++;
            else diff = Math.abs(z - otherEl[2]);
            if (contacts === 2 && diff === 1) {
                particles[i]--;
                particles[j]--;
            }
        }
    }
    const surfaceArea = particles.reduce((acc: number, el: number) => acc + el, 0);
    return surfaceArea;
};

const run = (lines: number[][]) => {
    const map: string[][][] = [];
    const voids: number[][] = [];
    let xMax = -Infinity;
    let yMax = -Infinity;
    let zMax = -Infinity;
    for (let i = 0; i < lines.length; i++) {
        const [x, y, z] = lines[i];
        if (x > xMax) xMax = x;
        if (y > yMax) yMax = y;
        if (z > zMax) zMax = z;
    }

    for (let i = 0; i < xMax + 1; i++) {
        map.push([]);
        for (let j = 0; j < yMax + 1; j++) {
            //@ts-ignore
            map[i].push([]);
            for (let k = 0; k < zMax + 1; k++) {
                //@ts-ignore
                map[i][j].push('.');
            }
        }
    }

    const checkInterior = (x: number, y: number, z: number): number => {
        if (map[x]?.[y]?.[z] === undefined) return 0;
        if (map[x]?.[y]?.[z] === '#') return 0;
        let zInterior = false;
        let yInterior = false;
        let yInteriorD = false;
        let xInterior = false;
        let xInteriorD = false;
        for (let i = z; i < zMax + 1; i++) {
            //@ts-ignore
            if (map[x][y][i] === '#') {
                zInterior = true;
                break;
            }
        }
        for (let j = y; j <= yMax; j++) {
            //@ts-ignore
            if (map[x][j]?.[z] === '#') {
                yInterior = true;
                break;
            }
        }
        for (let k = 0; k <= y; k++) {
            //@ts-ignore
            if (map[x][k]?.[z] === '#') {
                yInteriorD = true;
                break;
            }
        }
        for (let j = x; j <= xMax; j++) {
            //@ts-ignore
            if (map[j][y]?.[z] === '#') {
                xInterior = true;
                break;
            }
        }
        for (let k = 0; k <= x; k++) {
            //@ts-ignore
            if (map[k][y]?.[z] === '#') {
                xInteriorD = true;
                break;
            }
        }
        if (zInterior && yInterior && yInteriorD && xInterior && xInteriorD) {
            voids.push([x, y, z]);
            return 1 + checkInterior(x, y, z + 1);
        }
        return 0;
    };

    for (let i = 0; i < lines.length; i++) {
        const [x, y, z] = lines[i];
        //@ts-ignore
        map[x][y][z] = '#';
    }
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            for (let k = 0; k < map[i][j].length; k++) {
                if (map[i][j][k] === '#') {
                    if (map[i][j][k + 1] === '.') {
                        checkInterior(i, j, k + 1);
                    }
                }
            }
        }
    }

    const surfaceArea = getSurfaceArea(lines);
    console.log(surfaceArea);
    const negative = getSurfaceArea(voids);
    console.log('negative surface area', negative);
    console.log(surfaceArea - negative);
};

//last asnwser: 4482
// too low 2400
// too low 2546
// 4164 too high
// 2576 correct
export {};
