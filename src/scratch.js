const all = [
    [
        [4, 9],
        [15, 25],
        [17, 20],
    ],
    // [
    //     [17, 17],
    //     [-1, 28],
    // ],
    // [
    //     [25, 26],
    //     [1, 8],
    // ],
    // [
    //     [16, 26],
    //     [27, 29],
    // ],
    // [
    //     [27, 30],
    //     [11, 26],
    // ],
    // [
    //     [26, 30],
    //     [30, 31],
    // ],
];

for (let i = 0; i < all.length; i++) {
    const yArray = all[i];
    console.log(yArray);
    const reducedArr = yArray.reduce((acc, curr, i) => {
        if (i === 0) {
            return acc.concat(curr);
        }
        console.log('curr', curr);
        console.log('acc', acc);
        return acc.concat(curr);
    }, []);
    console.log('reducedArr', reducedArr);
}

const recur = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < array.length; j++) {
            const element = array[j];
        }
    }
};
