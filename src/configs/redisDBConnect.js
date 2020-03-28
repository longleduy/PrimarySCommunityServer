import redis from 'redis';
import Bluebird from 'bluebird';
import redisConnect from 'connect-redis';
import session from 'express-session';
import * as Promise from 'bluebird';

require('dotenv').config();
Bluebird.promisifyAll(redis.RedisClient.prototype)
Bluebird.promisifyAll(redis.Multi.prototype)

const RedisStore = redisConnect(session);
export const client = redis.createClient({
    port : process.env.REDIS_PORT,
    host : process.env.REDIS_HOST
})
client.auth(process.env.REDIS_AUTH, function(err, response){
    if(err){
    throw err;
    }
    });
client.on('connect', function () {
    if (process.env.NODE_ENV != 'test') {
        console.log(`RedisDB connecting...`)
    }
});
client.on("error", function (err) {
    throw err;
});
export const redisServer = session({
    secret: process.env.REDIS_SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, client: client }),
    cookie: {}
});
export const asyncClient = Promise.promisifyAll(client);