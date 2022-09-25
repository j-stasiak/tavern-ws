import { Client, Room } from "@colyseus/core";
import { IncomingMessage } from "http";
import { Message, WorldState } from "./WorldState";
import jwtDecode from "jwt-decode";
import { TavernClient } from "../proto/game/tavern_grpc_pb";
import { credentials } from "@grpc/grpc-js";
import { ChatMessageId, CreateChatMessage } from "../proto/game/tavern_pb";

export class World extends Room<WorldState> {
  private tavernClient!: TavernClient;

  override onCreate(options: any) {
    if (!process.env.TAVERN_API_GRPC_ADDRESS) {
      throw new Error("TAVERN_API_GRPC_ADDRESS is undefined!");
    }

    this.tavernClient = new TavernClient(
      process.env.TAVERN_API_GRPC_ADDRESS,
      credentials.createInsecure()
    );
    this.setState(new WorldState());
    this.registerEvents();
  }

  override onAuth(client: Client, options: any, request?: IncomingMessage) {
    if (!options.token) {
      throw new Error("No JWT provided!");
    } else {
      const user = jwtDecode(options.token);
      return user;
    }
  }

  override onJoin(player: Client, options: any, user: any) {
    this.state.createPlayer(player.sessionId, user.username);
  }

  registerEvents() {
    this.onMessage("MESSAGE_SENT", (player: Client, data: any) => {
      // TODO: Send chat message to tavern-api and save it in db
      const chatMessage = new CreateChatMessage();
      chatMessage.setUserid(player.auth.sub);
      chatMessage.setMessage(data.message);

      this.tavernClient.sendMessage(chatMessage, (error, response) => {
        const message = new Message();
        message.id = response.getId();
        message.userId = player.auth.sub;
        message.nick = player.auth.username;
        message.message = data.message;
        this.state.messages.push(message);
      });
    });

    this.onMessage("MESSAGE_LIKED", (player: Client, { messageId }) => {
      const chatMessageId = new ChatMessageId();
      chatMessageId.setId(messageId);

      this.tavernClient.likeMessage(chatMessageId, (err, response) => {
        const index = this.state.messages.findIndex(
          (message) => message.id === messageId
        );
        this.state.messages[index].likesCount = response.getCount();
      });
    });

    this.onMessage("PLAYER_MOVED", (player: Client, data: any) => {
      this.state.movePlayer(player.sessionId, data);
    });

    this.onMessage("PLAYER_MOVEMENT_ENDED", (player: Client, data: any) => {
      this.state.stopPlayer(player.sessionId, data);
    });

    this.onMessage("PLAYER_CHANGED_MAP", (player: Client, data: any) => {
      this.state.setPlayerMap(player.sessionId, data.map);
      const p = this.state.getPlayer(player.sessionId);
      p.x = 300;
      p.y = 75;
    });
  }

  override onLeave(player: Client, consented: any) {
    this.state.players.delete(player.sessionId);
  }

  override onDispose() {
    this.state.players.clear();
    this.state.messages.clear();
  }
}
