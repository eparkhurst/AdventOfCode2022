const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err:any, data:any) => {
    if (err) throw err;
    const lines = data.split('\n')
    const topCals: number[] = []
    let tempCal = 0
    lines.forEach((line: string) => {
        if(line.length === 0) {
            if(topCals.length < 3){
                topCals.push(tempCal)
                topCals.sort(function(a, b) {
                    return a - b;
                  });
            }else if (tempCal > topCals[0]){
                topCals[0] =  tempCal
                topCals.sort(function(a, b) {
                    return a - b;
                  });
            }
            tempCal = 0
        }else{
            tempCal += parseInt(line)
        }
    })
    const total = topCals.reduce((a, b) => a + b, 0)
    console.log(total)
})

export {}