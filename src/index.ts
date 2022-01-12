import dotenv from "dotenv";
dotenv.config();
import io from "socket.io";
import { configureGameEvents } from "./game";
import { configureChatEvents } from "./chat";
import { createClient } from "redis";
import { CodeClient } from "./proto/game/code_grpc_pb";
import * as grpc from "@grpc/grpc-js";
//import { CodeRequest } from "./proto/game/code_pb";
//import { Struct } from "google-protobuf/google/protobuf/struct_pb";

const redis = createClient();
const server = new io.Server();
const PORT = Number(process.env.PORT) || 4001;
const ISO_PORT = Number(process.env.ISO_PORT) || 4002;
const client = new CodeClient(
  `iso:${ISO_PORT}`,
  grpc.ChannelCredentials.createInsecure()
);
// How to send gRPC requests:
/*const code = new CodeRequest();
code.setGameobject(Struct.fromJavaScript({ position: { x: 10, y: 20 } }));
code.setUserid("5");
code.setCode("move(5, -4)");

client.executeCode(code, (err, res) => {
  if (err) {
    console.log(err);
  }
});*/
let corsOrigin;

if (process.env.NODE_ENV === "development") {
  corsOrigin = "*";
} else {
  corsOrigin = process.env.TAVERN_FRONTEND_HOST;
}

server.on("connection", (socket) => {
  console.log("connected!");
  configureGameEvents(server, socket, redis);
  configureChatEvents(server, socket, redis);
});

server.listen(PORT, { cors: { origin: corsOrigin } });
console.log(`Listening on port *:${PORT}`);
