const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err:any, data:any) => {
    if (err) throw err;
    run(data.trim().split('\n'))
})
const tree = {
    _size: 0
} as any
const sizeMap = {}
let total = 0
const deletable: number[] = []

const run = (lines: string[]) => {
    let myPath = ''
    let curDir = tree as any
    lines.forEach((line: string) => {
        const lineArr = line.split(' ')
        if(lineArr[0] === '$'){
            if(lineArr[1] === 'cd'){
                if( lineArr[2] === '..'){
                    const size = curDir._size
                    myPath = myPath.split('/').slice(0,-1).join('/')
                    curDir = getCurDir(myPath)
                    // this might be a bug
                    // curDir._size += size

                } else if (lineArr[2] === '/'){
                    myPath = '/'
                    curDir = getCurDir(myPath)
                } else {
                    myPath = myPath + '/' + lineArr[2]
                    curDir = curDir[lineArr[2]]
                }
            }
        } else if (lineArr[0] === 'dir'){
            const dir = lineArr[1]
            if (!curDir[dir]){
                curDir[dir] = {
                    _size:0
                }

            }
        } else {
            const file = lineArr[1]
            if (!curDir[file]){
                curDir[file] = lineArr[0]
                curDir._size += parseInt(lineArr[0])
            }
        }
    })

    recur(tree)

    console.log(tree._size)
    const freeSpace = 70000000-tree._size
    const minDelete = 30000000 - freeSpace
    console.log('free space: ', freeSpace)
    console.log('min delete: ', minDelete)
    const sorted =  deletable.sort((a,b) => a-b)
    console.log(sorted)
}
const getCurDir = (path: string) => {
    let o = tree as any
    const pathArr = path.split('/').filter((dir: string) => dir !== '')
    for (let i = 0; i < pathArr.length; i++) {
        const dir = pathArr[i];
        if (o[dir]){
            o = o[dir]
        } else {    
            console.log('mwap mwap', pathArr, dir)
        }
    }
    return o
}

const recur = (o: any) => {
    const keys = Object.keys(o)
    for (let i = 0; i < Object.keys(o).length; i++) {
        const element = o[keys[i]];
        if (typeof element === 'object'){
            o._size += recur(element)
        }
        
    }
    if(o._size > 3956976){
        deletable.push(o._size)
    }
    return o._size
}

export {}

//3669401 is too low