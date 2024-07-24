import { myFetch } from "../src/myFetch.js"

test("fetch post 66 with myFetch", async () => {
  const post = {
    userId: 7,
    id: 66,
    title: "repudiandae ea animi iusto",
    body: "officia veritatis tenetur vero qui itaque\nsint non ratione\nsed et ut asperiores iusto eos molestiae nostrum\nveritatis quibusdam et nemo iusto saepe"
    }
  // const json = await myFetch('http://localhost:3000/66')
  // expect(json).toEqual(post)
  expect(myFetch('http://localhost:3000/66')).resolves.toEqual(post)
})

test("fetch 100 posts with myFetch", async () => {
  // Time matters... 
  let json 
  for (let j=1; j <=100; j++) {
    for (let i=1; i <= 100; i++) {
      json = await myFetch(`http://localhost:3000/${i}`)
    }
  }
}, 30 * 1000)


/*
   json-server
   https://github.com/typicode/json-server

   {JSON} Placeholder
   https://jsonplaceholder.typicode.com/
*/