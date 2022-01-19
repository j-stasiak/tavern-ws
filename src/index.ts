import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import { Server, RedisPresence } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { monitor } from "@colyseus/monitor";
import { PokeWorld } from "./game/PokeWorld";

const PORT = Number(process.env.PORT) || 4001;
const app = express();

app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
  }),
  presence: new RedisPresence({ host: "cache" }),
});

gameServer.define("poke_world", PokeWorld);

app.use("/monitor", monitor());

gameServer.listen(PORT);
console.log(`Listening on ws://localhost:${PORT}`);
