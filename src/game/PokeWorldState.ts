import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
export class Player extends Schema {
  @type("number")
  x = 352;

  @type("number")
  y = 1216;

  @type("string")
  position = "front";

  @type("string")
  map = "town";

  @type("string")
  sessionId = "";

  @type("boolean")
  walking = false;

  @type("string")
  nick = "";
}

export class Message extends Schema {
  formatDate() {
    // TODO Send utc and change it on frontend to local
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  @type("string")
  message = "";

  @type("string")
  nick = "";

  @type("string")
  date = this.formatDate();
}

export class PokeWorldState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type({ array: Message })
  messages = new ArraySchema<Message>();

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

  createPlayer(sessionId: string, username: string) {
    const player = new Player();
    player.sessionId = sessionId;
    player.nick = username;
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
    player.walking = true;
    if (movement.x) {
      player.x = movement.x;
    }
    if (movement.y) {
      player.y = movement.y;
    }
    if (movement.position) {
      player.position = movement.position;
    }
  }

  stopPlayer(sessionId: string, movement: any) {
    const player = this.players.get(sessionId);
    if (!player) {
      throw new Error("No player with this sessionId!");
    }
    player.walking = false;
    player.position = movement.position;
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
