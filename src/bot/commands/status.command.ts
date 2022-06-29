import { TransformPipe } from '@discord-nestjs/common';
import { Command, DiscordCommand, UsePipes } from '@discord-nestjs/core';

import {
  // ContextMenuInteraction,
  InteractionReplyOptions,
  MessageEmbed,
} from 'discord.js';
import { Embed } from '../components/embed';
import { NitradoService } from '../../nitrado/services/nitrado.service';
import { ArkService } from '../../ark/services/ark.service';

@Command({
  name: 'status',
  description: 'Get server status',
})
@UsePipes(TransformPipe)
export class StatusCommand implements DiscordCommand {
  constructor(private nitrado: NitradoService, private ark: ArkService) {}

  async handler(/* interaction: ContextMenuInteraction, TODO */): Promise<InteractionReplyOptions> {
    const machine = await this.nitrado.server();
    const server = await this.ark.server({
      host: machine.ip,
      port: machine.query_port,
    });
    return {
      embeds: [
        new MessageEmbed()
          .setTitle(machine.game_human)
          .setColor(
            Embed.getColorForMachineAndServerStatus({
              machineStatus: machine.status,
              serverStatus: server.status,
            }),
          )
          .addFields([
            { name: 'Nom', value: machine.settings.config['server-name'] },
            {
              name: 'Message du jour',
              value: machine.settings.config['message-of-the-day'],
            },
            { name: 'Adresse IP', value: machine.ip },
            { name: 'Port', value: String(machine.query_port) },
            { name: 'Machine', value: machine.status, inline: true },
            { name: 'Serveur', value: server.status, inline: true },
            ...(server.status === 'online'
              ? [
                  Embed.getServerLinkEmbedField(machine),
                  {
                    name: 'Players',
                    value: `${server.server.players.length}/${server.server.maxPlayers}`,
                    inline: true,
                  },
                ]
              : []),
          ]),
      ],
    };
  }
}
