
import { redisClient } from "./config/redisClient.js";

function ping () {
    return redisClient.ping()
}

export { ping }