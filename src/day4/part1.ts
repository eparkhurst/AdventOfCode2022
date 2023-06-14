const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err:any, data:any) => {
    if (err) throw err;
    run(data.split('\n'))
})


const run = (lines: string[]) => {
    let count = 0
    lines.forEach((line: string) => {
        const [elf1, elf2] = line.split(',')
        const min1 = parseInt(elf1.split('-')[0])
        const max1 = parseInt(elf1.split('-')[1])
        const min2 = parseInt(elf2.split('-')[0])
        const max2 = parseInt(elf2.split('-')[1])
        if(min1 <= min2 && max1 >= max2) count++
        else if(min2 <= min1 && max2 >= max1) count++
    })
    console.log(count)
}

export {}