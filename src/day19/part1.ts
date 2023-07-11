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

const getNewRobots = (bluePrint: any, max: Resources, resources: Resources, robots: Resources, i: number) => {
    const possibleRobots: Robot[] = [];
    for (const robot in bluePrint) {
        // @ts-ignore
        if (robot !== 'geode' && robots[robot] >= max[robot]) continue;

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
    const recur = (bluePrint: any, max: Resources, resources: Resources, robots: Resources, i: number): number => {
        if (i === 0) {
            return resources.geode;
        }

        const key = `${i}${Object.values(robots).join('')}${Object.values(resources).join('')}`;

        if (memo[key]) {
            return resources.geode;
        } else {
            memo[key] = 1;
        }

        const possibleRobots = getNewRobots(bluePrint, max, resources, robots, i);

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
            const geode = recur(bluePrint, max, nextResources, { ...robots, [robot]: robots[robot] + 1 }, i - 1);
            if (geode > maxGeodes) {
                maxGeodes = geode;
            }
        }
        const noNewBot = recur(bluePrint, max, { ...resources }, { ...robots }, i - 1);
        return Math.max(noNewBot, maxGeodes);
    };

    const geode = recur(bluePrint, max, resources, bots, 24);
    return geode;
};

const run = (blueprints: any[]) => {
    const final = blueprints.reduce((max: number, bluePrint: any, i: number) => {
        const geode = runBluePrint(bluePrint);
        console.log('geode', geode);
        max += (i + 1) * geode;
        return max;
    }, 0);
    console.log(final);
};

export {};
