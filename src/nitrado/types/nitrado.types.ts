declare namespace Nitrado {
  type GameServer = {
    must_be_started: boolean;
    status:
      | 'started'
      | 'stopped'
      | 'stopping'
      | 'restarting'
      | 'suspended'
      | 'backup_restore'
      | 'backup_creation';
    websocket_token: string;
    hostsystems: {
      linux: {
        hostname: string;
        status: string;
      };
    };
    username: string;
    managed_root: boolean;
    user_id: number;
    service_id: number;
    location_id: number;
    minecraft_mode: number;
    ip: string;
    ipv6: string;
    port: number;
    query_port: number;
    rcon_port: number;
    label: string;
    type: string;
    memory: string;
    memory_mb: number;
    game: string;
    game_human: string;
    settings: {
      config: {
        'server-name': string;
        'message-of-the-day': string;
        'server-password': string;
      };
    };
  };

  type ServerStatus = {
    status: 'success';
    data: {
      gameserver: GameServer;
    };
  };

  type StopServer = {
    status: 'success';
    message: 'Server will be stopped now.';
  };

  type RestartServer = {
    status: 'success';
    message: 'Server will be restarted now.';
  };
}
