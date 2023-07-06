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

    const recur = (label: string, time: number, rate: number, openValves: any): number => {
        // times up, return rate
        if (time == 1) {
            return rate;
        }
        //add to memo
        if (memo[label]) {
            if (memo[label][time] > rate) return rate;
            memo[label][time] = rate;
        } else {
            memo[label] = { [time]: rate };
        }

        const valve = valves[label];

        //stay put
        const stay = recur(label, time - 1, rate, { ...openValves });
        //open a valve
        let open = 0;
        if (valve.rate && !openValves[label]) {
            open = recur(label, time - 1, rate + valve.rate, { ...openValves, [label]: true });
        }

        //move to another valve
        let move = 0;

        for (let i = 0; i < valve.tunnels.length; i++) {
            const newValve = recur(valve.tunnels[i], time - 1, rate, { ...openValves });
            move = Math.max(move, newValve);
        }

        return rate + Math.max(move, open, stay);
    };

    const final = recur('AA', 30, 0, {});
    console.log(final);
};

// 1852 too low

export {};
