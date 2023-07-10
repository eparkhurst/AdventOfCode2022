const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const lines = data.trim().split('\n');

    run(lines);
});

type Valves = {
    [key: string]: {
        rate: number;
        tunnels: string[];
    };
};

type Graph = {
    [key: string]: {
        rate: number;
        tunnels: {
            [key: string]: number;
        };
    };
};

const format = (lines: string[]): Graph => {
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
    console.log(Object.keys(valves).length);

    console.log(valves);
    const graph: any = {};

    for (const label in valves) {
        if (valves[label].rate > 0 || label === 'AA') {
            graph[label] = {
                rate: valves[label].rate,
            };
        }
    }
    for (const label in graph) {
        graph[label].tunnels = getDistances(valves, label, Object.keys(graph));
    }
    return graph;
};

const getDistances = (valves: Valves, startingNode: string, nodes: string[]): string[] => {
    const distances: any = {};
    for (let i = 0; i < nodes.length; i++) {
        const nextNode = nodes[i];
        if (nextNode === startingNode || nextNode == 'AA') continue;
        const queue: any = valves[startingNode].tunnels.map((tunnel: string) => [tunnel, 1]);
        const visited: any = [];
        while (queue.length) {
            const test = queue.shift();
            if (!test) break;
            const [node, distance] = test;
            if (visited.includes(node)) continue;
            visited.push(node);
            if (node === nextNode) {
                distances[nextNode] = distance;
                break;
            }
            if (valves[node]) {
                valves[node].tunnels.forEach((tunnel: string) => {
                    queue.push([tunnel, distance + 1]);
                });
            }
        }
    }
    return distances;
};

type Memo = {
    [label: string]: number;
};

const run = (lines: string[]) => {
    console.log(lines.length);
    const graph = format(lines);
    const fullLength = Object.keys(graph).length;
    const max = Object.values(graph).reduce((acc: number, node: any) => {
        acc += node.rate;
        return acc;
    }, 0);

    const memo: Memo = {};

    const recur = (time: number, flow: number, current: string, opened: string[]): number => {
        // console.log(time, flow, current, opened);
        if (time <= 1) {
            return flow;
        }

        if (flow === max) {
            return flow * time;
        }

        const key = `${current}-${time}-${opened.join('')}-${flow}`;
        if (memo[key] > flow * time) {
            return memo[key];
        }

        // open valve
        let open = -1;
        if (!opened.includes(current)) {
            const nextFlow = flow + graph[current].rate;
            open = flow + recur(time - 1, nextFlow, current, [...opened, current]);
        }

        // move to new valve
        let move = -1;
        for (const tunnel in graph[current].tunnels) {
            if (tunnel === 'AA') continue;
            const distance = graph[current].tunnels[tunnel];
            if (time - distance < 1) continue; // too far away
            const nextTime = time - distance;
            const newFlow = flow * distance + recur(nextTime, flow, tunnel, [...opened]);
            move = Math.max(move, newFlow);
        }

        //stay
        // const stay = flow * (time - 1);
        const best = Math.max(open, move);
        memo[key] = best;
        return best;
    };
    const final = recur(30, 0, 'AA', ['AA']);

    console.log(final);
    // console.log(memo);
};

// 1852 too low
// 1880 is correct

export {};
