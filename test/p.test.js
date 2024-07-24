import { p1, p2 } from "../src/p.js"

test("promise test - resolve", async () => {
    expect(p1('bingo')).resolves.toBe('bingo')
})

test("promise test - reject", async () => {
    expect(p1('tango')).rejects.toBe('tango')
})

test("promise test - throw", async () => {
    expect(p2('tango')).rejects.toThrow()
})
