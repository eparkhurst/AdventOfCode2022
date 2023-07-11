const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data.trim().split('\n');

    run(format(lines));
});

type Resources = {
    ore: number;
    clay: number;
    obsidian: number;
    geode: number;
};
type Robot = 'ore' | 'clay' | 'obsidian' | 'geode';
const format = (lines: string[]) => {
    return lines.map((line: string) => {
        const rules = line.split('.').filter((el: string) => !!el);
        let bluePrint: any = {};
        rules.forEach((rule: string) => {
            const [_, logic] = rule.split('Each ');
            const [type, cost] = logic.split(' robot costs ');
            bluePrint[type] = {};
            const kinds = cost.split(' and ');
            kinds.forEach((kind: string) => {
                const [amount, resource] = kind.split(' ');
                bluePrint[type][resource] = parseInt(amount, 10);
            });
        });
        return bluePrint;
    });
};

const recur = (
    bluePrint: any,
    max: Resources,
    resources: Resources,
    robots: Resources,
    time: number,
    memo: any,
): number => {
    if (time === 0) {
        return resources.geode;
    }

    const key = `${time}-${Object.values(robots).join('')}${Object.values(resources).join('')}`;

    if (memo[key]) {
        return memo[key];
    }

    let maxGeodes = resources.geode + robots.geode * time;
    const robotArr = Object.keys(bluePrint) as Robot[];
    for (let i = 0; i < robotArr.length; i++) {
        const robot = robotArr[i] as Robot;
        if (robot !== 'geode' && robots[robot] >= max[robot]) continue;

        let delay = 0;
        const robotCost: Resources = bluePrint[robot];
        let skip = false;
        const costArr = Object.keys(robotCost);
        for (let j = 0; j < costArr.length; j++) {
            const resource = costArr[j] as Robot;
            if (robots[resource] === 0) {
                skip = true;
                break;
            }
            if (resources[resource] >= robotCost[resource]) continue;
            const possibleDelay = Math.floor((robotCost[resource] - resources[resource]) / robots[resource]);
            if (possibleDelay < 0) {
                console.log('whoa');
            }
            if (possibleDelay > delay) {
                delay = possibleDelay;
            }
        }
        if (skip) continue;

        const timeLeft = time - delay - 1;
        if (timeLeft <= 0) continue;

        const nextRobots = { ...robots };
        // update amount of resources
        const nextResources = robotArr.reduce((next: any, type: Robot) => {
            next[type] = resources[type] + robots[type] * (delay + 1);
            return next;
        }, {});

        for (const type in robotCost) {
            //@ts-ignore
            nextResources[type] -= robotCost[type];
        }
        nextRobots[robot] += 1;
        const geodes = recur(bluePrint, max, nextResources, nextRobots, timeLeft, memo);
        if (geodes > maxGeodes) {
            maxGeodes = geodes;
        }
    }
    memo[key] = maxGeodes;
    return maxGeodes;
};

const runBluePrint = (bluePrint: any) => {
    const resources: Resources = {
        ore: 0,
        clay: 0,
        obsidian: 0,
        geode: 0,
    };
    const bots: Resources = {
        ore: 1,
        clay: 0,
        obsidian: 0,
        geode: 0,
    };
    const max: Resources = Object.values(bluePrint).reduce(
        (max: Resources, robot: any) => {
            for (const resource in robot) {
                // @ts-ignore
                if (robot[resource] > max[resource]) {
                    // @ts-ignore
                    max[resource] = robot[resource];
                }
            }
            return max;
        },
        { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    );
    console.log('max', max);
    const memo: any = {};
    const geode = recur(bluePrint, max, resources, bots, 24, memo);
    return geode;
};

// const run = (blueprints: any[]) => {
//     console.log('blueprints', blueprints[0]);
//     let final = 1;
//     for (let i = 0; i < 2; i++) {
//         const geode = runBluePrint(blueprints[i]);
//         console.log('geode', geode);
//         final = final * geode;
//     }
//     console.log(final);
// };
const run = (bluePrints: any[]) => {
    console.log('blueprints', bluePrints[0]);
    const geode = runBluePrint(bluePrints[0]);
    console.log('geode', geode);
};

export {};
