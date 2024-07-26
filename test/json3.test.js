import { hisFetch } from "../src/hisFetch.js"
import { disconnect } from "../src/config/redisClient.js";

beforeAll(async () => {    
});

afterAll(async () => {
  await disconnect()
});

test.skip("fetch post 66 with hisFetch - miss", () => {
  const post = {
    userId: 7,
    id: 66,
    title: "repudiandae ea animi iusto",
    body: "officia veritatis tenetur vero qui itaque\nsint non ratione\nsed et ut asperiores iusto eos molestiae nostrum\nveritatis quibusdam et nemo iusto saepe",
    cacheStatus: 'miss'
    }
  expect(hisFetch('http://localhost:3000/api/posts/66', { cache: 'no-store' })).resolves.toEqual(post)
})

test.skip("fetch post 66 with hisFetch - hit", () => {
  const post = {
    userId: 7,
    id: 66,
    title: "repudiandae ea animi iusto",
    body: "officia veritatis tenetur vero qui itaque\nsint non ratione\nsed et ut asperiores iusto eos molestiae nostrum\nveritatis quibusdam et nemo iusto saepe",
    cacheStatus: 'hit'
    }
  expect(hisFetch('http://localhost:3000/api/posts/66', { cache: 'no-store' })).resolves.toEqual(post)
})


test("fetch 100 posts by 10 times with hisFetch", async () => {
  // Time matters... 
  let json 
  for (let j=1; j <=10; j++) {
    for (let i=1; i <= 100; i++) {
      json = await hisFetch(`http://localhost:3000/api/posts/${i}`, { cache: 'no-store' })
    }
  }
}, 60 * 1000)


/*
   json-server
   https://github.com/typicode/json-server

   {JSON} Placeholder
   https://jsonplaceholder.typicode.com/
*/