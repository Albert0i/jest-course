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



/*
   ioredis
   https://github.com/redis/ioredis

   npm test -t sum 
*/