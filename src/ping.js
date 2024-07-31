
import { redisClient } from "./config/redisClient.js";

function ping () {
    return redisClient.ping()
}

export { ping }

/*
node-cron
https://www.npmjs.com/package/node-cron

crontab guru
https://crontab.guru/
*/