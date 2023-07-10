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

const getNewRobots = (bluePrint: any, resources: Resources, robots: Resources, i: number) => {
    const possibleRobots: Robot[] = [];
    for (const robot in bluePrint) {
        if (robot === 'ore' && robots.ore > 3) continue;

        if (robot === 'clay') {
            if (resources.clay > bluePrint.obsidian.clay * i) continue;
        }
        if (robot === 'obsidian') {
            if (resources.obsidian > bluePrint.geode.obsidian * i) continue;
        }
        const robotCost: Resources = bluePrint[robot];
        let canBuild = true;
        for (const resource in robotCost) {
            // @ts-ignore
            if (resources[resource] < robotCost[resource]) {
                canBuild = false;
            }
        }
        if (canBuild) {
            //@ts-ignore
            possibleRobots.push(robot);
        }
    }
    return possibleRobots;
};

const memo: any = {};
let once = true;
const recur = (bluePrint: any, resources: Resources, robots: Resources, i: number): number => {
    if (i < 1) {
        if (once) {
            console.log(resources);
            once = false;
        }
        return -1;
    }

    if (memo[`${i}${Object.values(robots).join('')}${Object.values(resources).join('')}`]) {
        return resources.geode;
    } else {
        memo[`${i}${Object.values(robots).join('')}${Object.values(resources).join('')}`] = 1;
    }

    const possibleRobots = getNewRobots(bluePrint, resources, robots, i);

    for (let type in robots) {
        //@ts-ignore
        resources[type] += robots[type];
    }

    let maxGeodes = 0;

    for (let j = 0; j < possibleRobots.length; j++) {
        const robot = possibleRobots[j];
        const nextResources = { ...resources };
        for (const resource in bluePrint[robot]) {
            // @ts-ignore
            nextResources[resource] -= bluePrint[robot][resource];
        }
        const geode = recur(bluePrint, nextResources, { ...robots, [robot]: robots[robot] + 1 }, i - 1);
        if (geode > maxGeodes) {
            maxGeodes = geode;
        }
    }
    const noNewBot = recur(bluePrint, { ...resources }, { ...robots }, i - 1);
    return Math.max(noNewBot, maxGeodes);
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
    const geode = recur(bluePrint, resources, bots, 24);
    return geode;
};

const run = (bluprints: any[]) => {
    let final = runBluePrint(bluprints[1]);
    console.log(final);
};

export {};
