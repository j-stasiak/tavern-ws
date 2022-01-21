import { Client, Room } from "@colyseus/core";
import { Message, PokeWorldState } from "./PokeWorldState";
//TODO: Change to redis
export class PokeWorld extends Room<PokeWorldState> {
  override onCreate(options: any) {
    this.setState(new PokeWorldState());
    const message = new Message();
    message.nick = "BigDickNick";
    message.message = "Inzynierka mocno";
    message.date = new Date().toUTCString();
    this.state.messages.push(message);
    this.registerEvents();
  }

  override onJoin(player: Client, options: any) {
    console.log("ON JOIN");
    this.state.createPlayer(player.sessionId);
  }

  registerEvents() {
    this.onMessage("MESSAGE_SENT", (player: Client, data: any) => {
      console.log("MESSAGE SENT");
      const message = new Message();
      message.nick = data.nick;
      message.message = data.message;
      message.date = new Date().toUTCString();
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
    // this.state.players.
  }

  override onDispose() {
    console.log("ON DISPOSE");
  }
}
