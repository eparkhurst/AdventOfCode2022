const fs = require('fs');
const path = require('path');

const EQUAL = 'equal';

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data.trim().split('\n');

    run(lines);
});

const format = (lines: string[]) => {
    const valves: {
        [key: string]: any;
    } = {};
    for (let i = 0; i < lines.length; i++) {
        const [f, s] = lines[i]
            .replace(' tunnel leads to valve', '')
            .replace(' tunnels lead to valves', '')
            .replace('Valve', '')
            .split(';');
        const [label, rate] = f.split('has flow rate=');
        valves[label.trim()] = {
            rate: parseInt(rate),
            tunnels: s.split(', ').map((tunnel: string) => tunnel.trim()),
        };
    }
    return valves;
};

type Memo = {
    [label: string]: {
        [time: number]: number;
    };
};
const run = (lines: string[]) => {
    const valves = format(lines);
    console.log(valves);

    const memo: Memo = {};
    let count = 0;
    const recur = (label: string, time: number, rate: number, openValves: any): number => {
        if (time <= 0) {
            count++;
            return rate;
        }
        if (memo[label]) {
            if (memo[label][time] > rate) return memo[label][time];
            memo[label][time] = rate;
        } else {
            memo[label] = { [time]: rate };
        }
        let maxPressure = 0;
        const valve = valves[label];
        for (let i = 0; i < valve.tunnels.length; i++) {
            let r1 = -1;
            let r2 = -1;
            if (valve.rate && !openValves[label]) {
                openValves[label] = true;
                r1 = valve.rate + recur(valve.tunnels[i], time - 2, rate + valve.rate, { ...openValves });
            }
            r2 = recur(valve.tunnels[i], time - 1, rate, { ...openValves });
            maxPressure = Math.max(maxPressure, r1, r2);
        }
        return rate + maxPressure;
    };

    const final = recur('AA', 30, 0, {});
    console.log(final, count);
};

export {};
