import { Client, Room } from "@colyseus/core";
//TODO: Change to redis
const players: {
  [id: string]: { sessionId: string; map: string; x: number; y: number };
} = {};
export class PokeWorld extends Room {
  override onCreate(options: any) {
    console.log("ON CREATE");
    this.registerEvents();
  }

  override onJoin(player: Client, options: any) {
    console.log("ON JOIN");

    players[player.sessionId] = {
      sessionId: player.sessionId,
      map: "town",
      x: 352,
      y: 1216,
    };

    setTimeout(
      () => this.send(player, "CURRENT_PLAYERS", { players: players }),
      500
    );
    this.broadcast(
      "PLAYER_JOINED",
      { ...players[player.sessionId] },
      { except: player }
    );
  }

  registerEvents() {
    this.onMessage("PLAYER_MOVED", (player: Client, data: any) => {
      players[player.sessionId].x = data.x;
      players[player.sessionId].y = data.y;

      this.broadcast(
        "PLAYER_MOVED",
        {
          ...players[player.sessionId],
          position: data.position,
        },
        { except: player }
      );
    });

    this.onMessage("PLAYER_MOVEMENT_ENDED", (player: Client, data: any) => {
      this.broadcast(
        "PLAYER_MOVEMENT_ENDED",
        {
          sessionId: player.sessionId,
          map: players[player.sessionId].map,
          position: data.position,
        },
        { except: player }
      );
    });
    this.onMessage("PLAYER_CHANGED_MAP", (player: Client, data: any) => {
      players[player.sessionId].map = data.map;

      // this.send(player, {event: "CURRENT_PLAYERS", players: players})

      this.broadcast("PLAYER_CHANGED_MAP", {
        sessionId: player.sessionId,
        map: players[player.sessionId].map,
        x: 300,
        y: 75,
        players: players,
      });
    });
  }

  override onLeave(player: Client, consented: any) {
    console.log("ON LEAVE");

    this.broadcast("PLAYER_LEFT", {
      sessionId: player.sessionId,
      map: players[player.sessionId].map,
    });
    delete players[player.sessionId];
  }

  override onDispose() {
    console.log("ON DISPOSE");
  }
}
