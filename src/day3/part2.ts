const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err:any, data:any) => {
    if (err) throw err;
    run(data.split('\n'))
})

const getPriority = (char: string) => {
    const charcode = char.charCodeAt(0)
    if(charcode >= 65 && charcode <= 90){
        return charcode - 38
    }else{
        return charcode - 96
    }
}

const run = (lines: string[]) => {
    let final = 0
    for (let i = 0; i < lines.length; i+=3) {
        const line1 = lines[i];
        const line2 = lines[i+1];
        const line3 = lines[i+2];
        const match: string[] = []
        line1.split('').forEach((char, index) => {
            if(line2.includes(char)){
                match.push(char)
            }
        })
        var set = new Set(match);
        set.forEach((char, index) => {
            if(line3.includes(char)){
                final += getPriority(char)
            }
        })

    }
    console.log(final)
}

export {}

//3750 to high