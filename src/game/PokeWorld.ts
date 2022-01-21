import { Client, Room } from "@colyseus/core";
import { IncomingMessage } from "http";
import { Message, PokeWorldState } from "./PokeWorldState";
import jwtDecode from "jwt-decode";
//TODO: Change to redis
export class PokeWorld extends Room<PokeWorldState> {
  override onCreate(options: any) {
    this.setState(new PokeWorldState());
    this.registerEvents();
  }

  override onAuth(client: Client, options: any, request?: IncomingMessage) {
    if (!options.token) {
      throw new Error("No JWT provided!");
    }
    const user = jwtDecode(options.token);
    return user;
  }

  override onJoin(player: Client, options: any, user: any) {
    this.state.createPlayer(player.sessionId, user.username);
  }

  registerEvents() {
    this.onMessage("MESSAGE_SENT", (player: Client, data: any) => {
      const message = new Message();
      message.nick = data.nick;
      message.message = data.message;
      this.state.messages.push(message);
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
    console.log("ON DISPOSE");
  }
}
