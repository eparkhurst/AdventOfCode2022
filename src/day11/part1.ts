const fs = require('fs');
const path = require('path');

type Monkey = {
    items: number[];
    op: Function;
    test: Function;
    pass: number;
    fail: number;
    inspections: number;
};

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err: any, data: any) => {
    if (err) throw err;
    const monkeys = data.trim().split('\n\n');
    const structuredMonkeys = structureData(monkeys);
    run(structuredMonkeys);
});

const structureData = (monkeys: string[]): Monkey[] => {
    const array = [];
    for (const monkeyText of monkeys) {
        const monkey: any = {};
        const lines = monkeyText.split('\n');
        monkey.items = lines[1]
            .split(':')[1]
            .split(', ')
            .map((item) => Number(item.trim()));
        const operation = lines[2].split(': ')[1];
        monkey.op = function (old: any) {
            let cool = eval(operation.split('=')[1].trim());
            return cool;
        };
        const divisor = lines[3].split('by')[1].trim();
        monkey.test = (num: number) => {
            const bool = num % Number(divisor) === 0;
            return bool;
        };
        monkey.pass = Number(lines[4].split('monkey')[1].trim());
        monkey.fail = Number(lines[5].split('monkey')[1].trim());
        monkey.inspections = 0;
        array.push(monkey);
    }
    return array;
};
const runRound = (monkeys: Monkey[]) => {
    for (const monkey of monkeys) {
        monkey.inspections += monkey.items.length;
        for (const item of monkey.items) {
            const raw = monkey.op(item) / 3;
            const worry = Math.floor(raw);
            if (monkey.test(worry)) {
                monkeys[monkey.pass].items.push(worry);
            } else {
                monkeys[monkey.fail].items.push(worry);
            }
        }
        monkey.items = [];
    }
};

const run = (monkeys: Monkey[]) => {
    for (let i = 0; i < 20; i++) {
        runRound(monkeys);
    }
    const inspections = monkeys.map((monkey) => monkey.inspections);
    const max = Math.max(...inspections);
    inspections.splice(inspections.indexOf(max), 1);
    const secondMax = Math.max(...inspections);
    console.log(max * secondMax);
};

export {};
