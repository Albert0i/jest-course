
test("fetch post 66", async () => {
    const post = {
      userId: 7,
      id: 66,
      title: "repudiandae ea animi iusto",
      body: "officia veritatis tenetur vero qui itaque\nsint non ratione\nsed et ut asperiores iusto eos molestiae nostrum\nveritatis quibusdam et nemo iusto saepe"
      }
    const response = await fetch('http://localhost:3000/api/posts/66')
    const json = await response.json()
    expect(json).toEqual(post)
})

test("fetch 100 posts by 10 times", async () => {
  // Time matters... 
  let response, json 
  for (let j=1; j <=10; j++) {
    for (let i=1; i <= 100; i++) {
      response = await fetch(`http://localhost:3000/api/posts/${i}`)
      json = await response.json()
    }
  }
}, 60 * 1000)

/*
   json-server
   https://github.com/typicode/json-server

   {JSON} Placeholder
   https://jsonplaceholder.typicode.com/
*/