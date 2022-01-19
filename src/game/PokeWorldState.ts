//TODO: Add legit state for room
//src: https://github.com/colyseus/unity-demo-mmo/blob/master/Server/src/rooms/schema/RoomState.ts
import { Schema, type, MapSchema } from "@colyseus/schema";
export class Player extends Schema {
  @type("number")
  x = 352;

  @type("number")
  y = 1216;

  @type("string")
  map = "town";

  @type("string")
  sessionId = "";
}

export class PokeWorldState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  listPlayers() {
    const players = [];
    for (const [, player] of this.players) {
      players.push(player);
    }

    return players.map((player) => ({
      sessionId: player?.sessionId,
      map: player?.map,
      x: player?.x,
      y: player?.y,
    }));
  }

  createPlayer(sessionId: string) {
    const player = new Player();
    player.sessionId = sessionId;
    this.players.set(sessionId, player);
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

  movePlayer(sessionId: string, movement: any) {
    const player = this.players.get(sessionId);
    if (!player) {
      throw new Error("No player with this sessionId!");
    }
    if (movement.x) {
      player.x = movement.x;
    }
    if (movement.y) {
      player.y = movement.y;
    }
  }

  getPlayerMap(sessionId: string) {
    return this.players.get(sessionId)?.map ?? "";
  }

  setPlayerMap(sessionId: string, map: string) {
    const player = this.players.get(sessionId);
    if (player) {
      player.map = map;
    }
  }

  getPlayer(sessionId: string) {
    const player = this.players.get(sessionId);

    return {
      sessionId: player?.sessionId,
      map: player?.map,
      x: player?.x,
      y: player?.y,
    };
  }
}
