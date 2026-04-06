import IORedis, { Redis } from "ioredis";
import Redlock from "redlock";
import { serverConfig } from ".";

// export const redisClient = new IORedis(serverConfig.REDIS_SERVER_URL);

function connectToRedis() {
  try {
    let connection: Redis;

    return () => {
      if (!connection) {
        connection = new IORedis(serverConfig.REDIS_SERVER_URL);
        return connection;
      }
      return connection;
    };
  } catch (error) {
    console.error("Error to connect redis", error);
    throw error;
  }
}

export const getRedisConnObj = connectToRedis();

export const redlock = new Redlock([getRedisConnObj()], {
  driftFactor: 0.01,
  retryCount: 10,
  retryDelay: 200,
  retryJitter: 200,
});
