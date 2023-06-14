const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err:any, data:any) => {
    if (err) throw err;
    run(data.split('\n'))
})

type CrateMap = {
    [id:number]: string[]
}

const convertToCrateMap = (map: string[]) => {
    const regex = /\S/
    const crateMap : CrateMap = {1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]}
    map.forEach((line: string) => {
        crateMap[1].unshift(line[1])
        crateMap[2].unshift(line[5])
        regex.test(line[9]) && crateMap[3].unshift(line[9])
        regex.test(line[13]) && crateMap[4].unshift(line[13])
        regex.test(line[17]) && crateMap[5].unshift(line[17])
        regex.test(line[21]) && crateMap[6].unshift(line[21])
        regex.test(line[25]) && crateMap[7].unshift(line[25])
        regex.test(line[29]) && crateMap[8].unshift(line[29])
        regex.test(line[33]) && crateMap[9].unshift(line[33])
    })
    return crateMap
}

const run = (lines: string[]) => {
    const map = lines.slice(0,8)
    const crateMap = convertToCrateMap(map)

    const moves = lines.slice(10)
    moves.forEach((move: string) => {
        const sections = move.split(' ')
        const volume = parseInt(sections[1])
        const start = parseInt(sections[3])
        const end = parseInt(sections[5])
            const crates = crateMap[start].slice(-volume)
            crateMap[start].splice(-volume)
            crates && crateMap[end].push(...crates)
    })

    const finalString = Object.values(crateMap).reduce((final, crateStack: string[]) => {
        final += crateStack.pop()
        return final
    }, '')
    console.log(finalString)
}

export {}