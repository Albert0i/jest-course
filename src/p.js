
function p1(str) {
    return new Promise( async (resolve, reject) => {
        if (str === "bingo")
            resolve(str)
        else 
            reject(str)
    } )
}
    
function p2(str) {
    return new Promise( (resolve, reject) => {
        if (str === "bingo")
            resolve(str)
        else 
            throw new Error(str)
    } )
}

export { p1, p2 }