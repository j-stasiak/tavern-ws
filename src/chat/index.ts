import { RedisClientType } from "@node-redis/client/dist/lib/client";
import { Server, Socket } from "socket.io";

export const configureChatEvents = (
  server: Server,
  socket: Socket,
  redisClient: RedisClientType<any>
) => {};
