import jest from 'jest-mock'
import { sum, myFunction, fetchData, fetchPromise, fetchPromiseThrow } from "../src/sum.js"

test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3)
})

test("two plus two is four", () => {
    expect(2 + 2).toBe(4)
})

test("object assignment", () => {
    const data = { one: 1 }
    data['two'] = 2
    expect(data).toEqual({ one:1, two: 2})
})

test("null is falsy", () => {
    const n = null
    expect(n).toBeFalsy()
})

test("zero is falsy", () => {
    const n = 0
    expect(n).toBeFalsy()
})

test("one is truthy", () => {
    const n = 1
    expect(n).toBeTruthy()
})

test("throws on invalid input ", () => {
    expect(() => { 
        myFunction('foo')
    } ).toThrow()
})

test("the data is peanut butter", (done) => {
    function callback(data) {
        try {
            expect(data).toBe('peanut butter')            
        } catch (error) {
            // Code to handle the caught exception
            console.log(error)
        } finally {
            // Calling the done function to signal jest that the test is complete. 
            done()
        }
    }
    fetchData(callback)
})

test("the data is peanut butter", () => {
    expect(fetchPromise()).resolves.toBe('peanut butter')
})

test("the fetch fails with error", () => {
    expect(fetchPromiseThrow()).rejects.toThrow('Error')
})

test("the data is peanut buffer (async)", async () => {
    const data = await fetchPromise()
    expect(data).toBe('peanut butter')
})

test("mock implementation of a basic function", () => {
    const mock = jest.fn(x => 42 + x)
    expect(mock(1)).toBe(43)
    expect(mock).toHaveBeenCalledWith(1)
})

test("spy on a method of a object", () => {
    const video = {
        play() { return true }
    }
    const spy = jest.spyOn(video, 'play')
    video.play()
    expect(spy).toHaveBeenCalled()
    
    spy.mockRestore()
    expect(spy).not.toHaveBeenCalled()
})

/*
   JavaScript Testing with Jest – Crash Course
   https://youtu.be/IPiUDhwnZxA

   Getting `TypeError: jest.fn is not a function`
   https://stackoverflow.com/questions/46086970/getting-typeerror-jest-fn-is-not-a-function

   How can I test that a function has not been called?
   https://stackoverflow.com/questions/24282390/how-can-i-test-that-a-function-has-not-been-called

   npm test -t sum 
*/