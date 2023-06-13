const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err:any, data:any) => {
    if (err) throw err;
    const lines = data.split('\n')
    const elfCals: number[] = []
    let tempCal = 0
    lines.forEach((line: string) => {
        if(line.length === 0) {
            elfCals.push(tempCal)
            tempCal = 0
        }else{
            tempCal += parseInt(line)
        }
    })
    console.log(Math.max(...elfCals))
})

export {}