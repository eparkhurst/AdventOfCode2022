const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err:any, data:any) => {
    if (err) throw err;
    run(data.split('\n'))
})


const run = (lines: string[]) => {
    const final = lines.reduce((acc: number, line:string) => {
        const half = line.length / 2
        const firstHalf = line.slice(0, half)
        const secondHalf = line.slice(half)

        firstHalf.split('').some((char, index) => {
            if(secondHalf.includes(char)){
                const charcode = char.charCodeAt(0)
                if(charcode >= 65 && charcode <= 90){
                    acc += (charcode - 38)
                    return acc
                }else{
                    acc += (charcode - 96)
                    return acc
                }
            }
        })
        return acc
    }, 0)
    console.log(final)
}

export {}