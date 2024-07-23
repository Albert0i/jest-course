import { redisClient } from "../src/config/redisClient.js"

beforeAll(async () => {    
  });

afterAll(async () => {
    await redisClient.quit()
  });

test("ping", async () => {
  const pong = await redisClient.ping()
  expect(pong).toBe('PONG')
})

test("incrby", async() => {
  const TESTKEY = 'test:counter'
  await redisClient.set(TESTKEY, 0)

  for (var i = 1; i <= 100; i++) {
    await redisClient.incrby(TESTKEY, i)
  }
  const ret1 = await redisClient.get(TESTKEY)
  expect(ret1).toBe('5050')

  await redisClient.del(TESTKEY)
  const ret2 = await redisClient.exists(TESTKEY)
  expect(ret2).toBeFalsy()
})

/*
   ioredis
   https://github.com/redis/ioredis

   npm test -t sum 
*/