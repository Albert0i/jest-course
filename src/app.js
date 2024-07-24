import express from 'express';
import { redisClient } from './config/redisClient.js';
import jsonServer from 'json-server';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const port = 3000;

// Create a JSON Server instance
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middleware to check Redis cache before hitting JSON Server
server.use((req, res, next) => {
    const key = req.url;
    redisClient.get(key, (err, data) => {
        if (err) throw err;

        if (data !== null) {
            res.json(JSON.parse(data));
        } else {
            next();
        }
    });
});

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
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

// Example: Cache data in Redis
redisClient.set('/posts', JSON.stringify([{ "id": 1, "title": "Cached Post" }]));

// Close Redis connection
redisClient.quit();