import express from 'express';
// import { redisClient } from './config/redisClient.js';
import jsonServer from 'json-server';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: "json" };

const port = 3000;

// Create a JSON Server instance
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middleware to check Redis cache before hitting JSON Server
// server.use(async (req, res, next) => {
//     const key = req.url;
    
//     try {
//         const data = await redisClient.get(key);

//         if (data) {
//             res.json(JSON.parse(data));
//         } else {
//             next();
//         }
//     } catch (error) {
//         console.error('Error fetching data from Redis:', error);
//         next();
//     }
// });

server.use(middlewares);
server.use(router);

// Swagger UI setup
const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount the JSON Server at /api
app.use('/api', server);

// Start the combined server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Redis connection
// redisClient.on('connect', () => {
//     console.log('Connected to Redis');
// });

// Example: Cache data in Redis
//await redisClient.set('/posts', JSON.stringify([{ "id": 1, "title": "Cached Post" }]));

// Close Redis connection
// await redisClient.quit();