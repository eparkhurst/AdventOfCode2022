const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err:any, data:any) => {
    if (err) throw err;
    run(data.split('\n'))
})


const run = (lines: string[]) => {
    console.log(lines.length)
    let count = 0
    lines.forEach((line: string) => {
        const [elf1, elf2] = line.split(',')
        const min1 = parseInt(elf1.split('-')[0])
        const max1 = parseInt(elf1.split('-')[1])
        const min2 = parseInt(elf2.split('-')[0])
        const max2 = parseInt(elf2.split('-')[1])
        if(max1 >= min2 && min1 <= min2) count++
        else if(max2 >= min1 && min2 <= min1) count++
    })
    console.log(count)
}

export {}