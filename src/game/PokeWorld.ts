import { Client, Room } from "@colyseus/core";
import { PokeWorldState } from "./PokeWorldState";
//TODO: Change to redis
export class PokeWorld extends Room<PokeWorldState> {
  override onCreate(options: any) {
    this.setState(new PokeWorldState());
    this.registerEvents();
  }

  override onJoin(player: Client, options: any) {
    console.log("ON JOIN");
    this.state.createPlayer(player.sessionId);

    setTimeout(
      () =>
        this.send(player, "CURRENT_PLAYERS", {
          players: this.state.listPlayers(),
        }),
      500
    );
    this.broadcast("PLAYER_JOINED", this.state.getPlayer(player.sessionId), {
      except: player,
    });
  }

  registerEvents() {
    this.onMessage("PLAYER_MOVED", (player: Client, data: any) => {
      this.state.movePlayer(player.sessionId, data);

      this.broadcast(
        "PLAYER_MOVED",
        {
          ...this.state.getPlayer(player.sessionId),
          position: data.position,
        },
        { except: player }
      );
    });

    this.onMessage("PLAYER_MOVEMENT_ENDED", (player: Client, data: any) => {
      console.log("PLAYER_MOVEMENT_ENDED");
      this.broadcast(
        "PLAYER_MOVEMENT_ENDED",
        {
          sessionId: player.sessionId,
          map: this.state.getPlayerMap(player.sessionId),
          position: data.position,
        },
        { except: player }
      );
    });
    this.onMessage("PLAYER_CHANGED_MAP", (player: Client, data: any) => {
      this.state.setPlayerMap(player.sessionId, data.map);

      this.broadcast("PLAYER_CHANGED_MAP", {
        sessionId: player.sessionId,
        map: this.state.getPlayerMap(player.sessionId),
        x: 300,
        y: 75,
        players: this.state.listPlayers(),
      });
    });
  }

  override onLeave(player: Client, consented: any) {
    console.log("ON LEAVE");

    this.broadcast("PLAYER_LEFT", {
      sessionId: player.sessionId,
      map: this.state.getPlayerMap(player.sessionId),
    });
  }

  override onDispose() {
    console.log("ON DISPOSE");
  }
}
