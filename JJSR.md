# [J](https://github.com/typicode/json-server)[J](https://github.com/jestjs/jest)[S](https://www.npmjs.com/package/swagger-ui-express)[R](https://github.com/redis/redis)


```
“Few great deeds are committed by real underdogs.”
```

#### Prologue 
Real world issues become increasingly complicated when multiple parties are involved. While tools are envisaged and applied ingeniously to solve problem of a kind independently, combining and working together is quite another thing. 

The idea here is to showcase the tying up of tools. 


#### I. Server setup 
The first step is to combine [json-serverJ](https://github.com/typicode/json-server) and [Swagger UI](https://www.npmjs.com/package/swagger-ui-express) into a single server. 

app.js
```
import express from 'express';
import jsonServer from 'json-server';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'

const port = 3000;

// Create express app
const app = express();

// Create a JSON Server instance
const server = jsonServer.create();
const router = jsonServer.router('data/db.json');
const middlewares = jsonServer.defaults({ logger: false }); // Disable logging

server.use(middlewares);
server.use(router);

// Mount the JSON Server at /api
app.use('/api', server);

// set up Swagger UI in the root 
const swaggerDocument = YAML.load('./src/swagger.yaml')
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Start the combined server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

Sample data are [100 posts](https://jsonplaceholder.typicode.com/posts) acquired from [{JSON} Placeholder](https://jsonplaceholder.typicode.com/).

Based on the example `db.json`, the following routes are provided by json-server:
```
GET    /posts
GET    /posts/:id
POST   /posts
PUT    /posts/:id
DELETE /posts/:id
```

Thereupon, an [OpenAPI Specification](https://swagger.io/specification/) is created, either online [Swagger Editor](https://editor.swagger.io/) or [VSCode](https://code.visualstudio.com/) with [OpenAPI (Swagger) Editor](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi) extension will do. 

![alt swagger editor](img/SwaggerEditor.JPG)

swagger.yaml
```
openapi: 3.0.0
info:
  title: Posts API
  description: Posts Demo API
  contact:
    name: Alberto Iong
    email: albert0i@hotmail.com
  version: 1.0.0
servers: 
  - url: http://localhost:3000
  - url: http://127.0.0.1:3000
. . .   
```

To run the combined server: 
```
npm run dev 
```

![alt npm-run-dev](img/npm-run-dev.JPG)

And navigate to:
```
http://localhost:3000/
```

![alt swagger-ui-1](img/swagger-ui-1.JPG)

![alt swagger-ui-2](img/swagger-ui-2.JPG)

```
http://localhost:3000/api
```

![alt json-server](img/json-server.JPG)


#### II. myFetch
We slightly wrap the Javascript [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) to make it ready for subsequent retrofit. 

myFetch.js
```
function myFetch(url, options) {
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Parse the JSON data
        })
        .then(data => {
          resolve(data); // Resolve the Promise with the retrieved data
        })
        .catch(error => {
          reject(error); // Reject the Promise with the error
        });
    });
  } 

export { myFetch }
```


#### III. Redis 
Redis is a in-memory key-value store and well known for: 
1. Database cache 
2. Session store
3. Game leaderboard
4. Rate limiter 
5. Distributed messaging system

To start the Redis Server:
```
npm run redis
```
![alt redis](img/redis.JPG)

redisClient.js
```
import { Redis } from 'ioredis'

const redisClient = new Redis({
    port: 7000, // Redis port
    host: "127.0.0.1", // Redis host
  });

const disconnect = () => {
  redisClient.disconnect()
}

export { redisClient, disconnect }
```


#### IV. hisFetch 
Further enhancement is to add cache capability. 

hisFetch.js
```
import { redisClient } from "./config/redisClient.js"

const DEFAULT_NAMESPACE = "cache"
const DEFAULT_STATUS = 'cacheStatus'
const DEFAULT_TTL = 60    // seconds 

function hisFetch(url, options) {
    return new Promise( async (resolve, reject) => {
      const value = await redisClient.get(`${DEFAULT_NAMESPACE}:${url}`)

      if (value) { 
          // cache hit 
          let json = JSON.parse(value)
          json[DEFAULT_STATUS] = 'hit'
          resolve(json) 
        }
      else {
        // cache miss 
        try {
          const response = await fetch(url, options)          

          if (!response.ok) {
            throw new Error('Network response was not ok');
          } else {
            let data = await response.json()
            await redisClient.set(`${DEFAULT_NAMESPACE}:${url}`, JSON.stringify(data), 'EX', DEFAULT_TTL)
            data[DEFAULT_STATUS] = 'miss'
            resolve(data) // Resolve the Promise with the retrieved data
          }
        } catch (error) {
          reject(error) // Reject the Promise with the error
        }
      }
    });
  } 

export { hisFetch }
```


#### V. The metrics
Use jest to test: 

```
npm test -t json1
```
![alt json1](img/json1.JPG)

```
npm test -t json2
```
![alt json2](img/json2.JPG)

```
npm test -t json3
```
![alt json3](img/json3.JPG)


#### VI. Introspection
To fetch 100 posts from json-server is around 3 seconds, ie. 30 ms per post, total time is linear to number of posts. This is obvious in `fetch` and `myFetch`. 

However, in `hisFetch` the first round is from json-server, all other nine rounds are from Redis, this significant reduce the retrieval time. 

![alt cache1](img/cache1.JPG)

![alt cache1](img/cache1.JPG)


#### VII. Last touch
To ping Redis at an interval of five seconds using [node-cron](https://www.npmjs.com/package/node-cron). 
```
// Ping Redis every five seconds 
cron.schedule('*/5 * * * * *', async () => {    
    console.log(new Date(), await ping());
  });
```


#### VIII. Wrap up 
An [albert0i/jest-course](https://hub.docker.com/repository/docker/albert0i/jest-course/general) image has been created so that one can run the whole bunch of things in a confined docker environment. 

![alt make help](img/make.JPG)


#### IX. Bibliography 
1. [Up & Running with JSON Server (Part 1)](https://www.youtube.com/watch?v=mAqYJF-yxO8)
2. [Up & Running with JSON Server (Part 2)](https://www.youtube.com/watch?v=VF3TI4Pj_kM)
3. [{JSON} Placeholder](https://jsonplaceholder.typicode.com/)
4. [JavaScript Testing with Jest – Crash Course](https://youtu.be/IPiUDhwnZxA)
5. [Jest API](https://jestjs.io/docs/api)
6. [OpenAPI 3.0 Tutorial| Swagger Tutorial For Beginners | Design REST API Using Swagger Editor](https://youtu.be/mViFmjcDOoA)
7. [OpenAPI Specification, Version 3.1.0](https://swagger.io/specification/)
8. [Scheduling Tasks in Node.js | Cron Jobs in Real Projects](https://youtu.be/6gmdFPlkuhQ)
9. [node-cron](https://www.npmjs.com/package/node-cron)
10. [THE BIG FOUR](https://www.gutenberg.org/files/70114/70114-h/70114-h.htm)


#### Epilogue

A small talk on Data Propensity

[Data mining](https://dictionary.cambridge.org/dictionary/english-chinese-traditional/data-mining) is the process of using special software to look at large amounts of computer data in order to find out useful information, for example what types of product a company's customers buy. 

But there is no such thing as Data Propensity! It is a term *coined* by myself to indicate data distribution, access pattern, change rate, data lifespan and more. 

- Data distribution 

The discrepant value of a field. ie. *male*, *female* in `gender` field; *cotton*, *linen*, *nylon*, *polyester* in `material` field. Typically a separate lookup table would be setup to prevent directly storing the value in a RDBMS table. While in NoSQL database, it is encouraged to store the value amid the main document, ie. *data to be used together should be stored together* so that no subsequent joining or lookup is necessary. 

While table joining is an operation too important to be neglected and as yet it is an expensive operation, and therefore secondary index is created although it is not mandatory to do so. 

Lastly, knowing the data distribution is helpful in implementing *faceted search* in Redis. 

- Access pattern

In what ways the data is retrieved. In a Products table, there are `color`, `size` and `productOf` fields, to enable access to products via all combinations of keys, ie. 3P1 + 3P2 + 3P3 = 3 + 6 + 6 = 15! As you can see the number of compound index increase exponential... 

Indexes are disk files and required to build/rebuild on demand behind the scenes and always have cost of their own way. 

To foresee the search criteria and resort to table scan in certain circumstance can cut down the number of indexes to some extent. 

- Change rate 

The update frequency. Some tables are updated more frequently than the others. Transactional and CRUD data are subjected to different update cycle, history data are for analytic purpose and not update at all. Even in the same Persons table, `birthday` field rarely changes; `name` and `sex` fields seldom change; `marital status` and `mobile` change from time to time. 

[Tablespaces](https://dev.mysql.com/doc/refman/8.4/en/innodb-tablespace.html) in RDBMS is all about managing storage and physical placement of tables. More often than not, one just leaves data undistinguished in the same table and table space. 

- Lifespan 

The birth and death of data. Not all data leads the same life and neither do we. Transient data has to be purged repeatedly and regularly. This hinge on scheduled job or user intervention. Typically, if reserved tickets can not be committed within five minutes, it will be cancelled and return to ticket pool. 


> All data are equal, but some data are more equal than others.  

Data propensity does not have much to do with RDBMS, since nothing one can do with. In Redis, the story is different. One can choose the most appropriate data structure for one part of the data which makes the data model more complicated, and thus, more performant. 


### EOF (2024/08/02)
