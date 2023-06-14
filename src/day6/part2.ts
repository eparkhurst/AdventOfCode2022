const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err:any, data:any) => {
    if (err) throw err;
    run(data.trim())
})

const run = (lines: string) => {
    const lastFour = lines.slice(0,14).split('')
    const mostLines = lines.slice(14)

    mostLines.split('').some((char: string, index: number) => {
        lastFour.shift()
        lastFour.push(char)
        const set = new Set(lastFour)
        if(set.size === 14) {
            console.log(index + 15)
            return true
        }
    })
}

export {}