
function sum (a, b) {
    return a + b
}

function myFunction (input) {
    if (typeof input !== "number") 
        throw new Error("Invalid input")
}

function fetchData (callback) {
    setTimeout(() => {
        callback('peanut butter')
    }, 1000)
}

function fetchPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve('peanut butter'), 1000)
        //throw new Error("Error")
    })
}

function fetchPromiseThrow() {
    return new Promise((resolve, reject) => {        
        throw new Error("Error")
    })
}

export { sum, myFunction, fetchData, fetchPromise, fetchPromiseThrow }

/*
   ECMAScript Modules
   https://jestjs.io/docs/ecmascript-modules

   CAUTION
   Jest ships with experimental support for ECMAScript Modules (ESM).

   Execute node with --experimental-vm-modules, e.g. node --experimental-vm-modules node_modules/jest/bin/jest.js 
*/