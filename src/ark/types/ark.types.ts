declare module 'Ark' {
  type ArkServerStatus =
    | {
        status: 'online';
        server: Server;
      }
    | { status: 'offline' };

  type Server = {
    name: string;
    map: string;
    password: boolean;
    raw: {
      protocol: 17;
      folder: string;
      game: string;
      appId: number;
      numplayers: number;
      numbots: number;
      listentype: string;
      environment: string;
      secure: number;
      version: string;
      steamid: string;
      tags: string[];
    };
    maxPlayers?: number;
    players: Player[];
    bots: Player[];
    connect: string;
    ping: number;
  };

  type Player = {
    name?: string;
    raw: {
      score: number;
      time: number;
    };
  };
}
