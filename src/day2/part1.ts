const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err:any, data:any) => {
    if (err) throw err;
    run(data.split('\n'))
})

// A = Rock
// B = Paper
// C = Scissors

// X = Rock
// Y = Paper
// Z = Scissors

const throwPoints = {
    X: 1,
    Y: 2,
    Z: 3
}

const playRound = (elf: string, you: string) => {
    if(elf === 'A'){
        if(you === 'Z'){
            return 0
        }else if(you === 'X'){
            return 3
        }else if(you === 'Y'){
            return 6
        }
    } else if (elf === 'B'){
        if(you === 'X'){
            return 0
        }else if(you === 'Y'){
            return 3
        }else if(you === 'Z'){
            return 6
        }
    } else {
        if(you === 'Y'){
            return 0
        }else if(you === 'Z'){
            return 3
        }else if(you === 'X'){
            return 6
        }
    }
    //This should never happen
    return 0
}
type MyChoice = 'X'| 'Y'| 'Z'

const run = (lines: string[]) => {
 const result = lines.reduce((acc: number, line: string) => {
    const plays = line.split(' ')
    const you = plays[1] as MyChoice
    const points = playRound(plays[0], you)
    return acc + points + throwPoints[you]
 }, 0)
 console.log(result)
}

export {}