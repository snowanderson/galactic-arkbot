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
   * - GREEN if machine started and server online
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
    switch (machineStatus) {
      case 'started':
        return serverStatus === 'online' ? 'GREEN' : 'ORANGE';
      case 'stopped':
        return 'RED';
      default:
        return 'ORANGE';
    }
  }

  /**
   * Get a color corresponding to the success of API call
   * - GREEN if successful
   * - RED if failed
   * @param success: API call success
   */
  static getColorForAPISuccess(success: boolean): 'GREEN' | 'RED' {
    return success ? 'GREEN' : 'RED';
  }
}
