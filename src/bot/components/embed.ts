import { EmbedFieldData } from 'discord.js';
import type * as Ark from 'Ark';
import type * as Nitrado from 'Nitrado';

export class Embed {
  /**
   * Get an EmbedField with the Steam direct connect url
   * @param server: GameServer
   */
  static getServerLinkEmbedField(server: Nitrado.GameServer): EmbedFieldData {
    return {
      name: 'Lien pour rejoindre',
      value: `steam://connect/${server.ip}:${server.query_port}/${server.settings.config['server-password']}`,
    };
  }

  /**
   * Get a color corresponding to the machine and server status:
   * - GREEN if server is reachable
   * - RED if machine stopped
   * - ORANGE in other cases
   * @param status: GameServer status
   */
  static getColorForMachineAndServerStatus({
    machineStatus,
    serverStatus,
  }: {
    machineStatus: Nitrado.GameServer['status'];
    serverStatus: Ark.ArkServerStatus['status'];
  }): 'GREEN' | 'ORANGE' | 'RED' {
    if (serverStatus === 'online') {
      return 'GREEN';
    }
    if (machineStatus === 'stopped') {
      return 'RED';
    }
    return 'ORANGE';
  }
}
