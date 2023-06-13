const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err:any, data:any) => {
    if (err) throw err;
    run(data.split('\n'))
})

// A = Rock
// B = Paper
// C = Scissors

// X = lose
// Y = draw
// Z = win

const winLose = {
    X: 0,
    Y: 3,
    Z: 6,
}
const throwPoints = {
    A: 1,
    B: 2,
    C: 3,
}
type MyChoice = 'X'| 'Y'| 'Z'
type ElfChoice = 'A'| 'B'| 'C'

const playRound = (elf: ElfChoice, outcome: string) => {
    //lose
    if(outcome === 'X'){
        if(elf === 'A'){
            return 3
        } else if (elf === 'B'){
            return 1
        } else return 2
    //draw
    } else if (outcome === 'Y'){
        return throwPoints[elf]
    // win
    } else {
        if(elf === 'A'){
            return 2
        } else if (elf === 'B'){
            return 3
        } else return 1
    }
}

const run = (lines: string[]) => {
 const result = lines.reduce((acc: number, line: string) => {
    const plays = line.split(' ')
    const elf = plays[0] as ElfChoice
    const me = plays[1] as MyChoice
    const points = playRound(elf, me)
    return acc + points + winLose[me]
 }, 0)
 console.log(result)
}

export {}