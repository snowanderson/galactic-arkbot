import { TransformPipe } from '@discord-nestjs/common';
import { Command, DiscordCommand, UsePipes } from '@discord-nestjs/core';

import {
  ContextMenuInteraction,
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

  async handler(
    interaction: ContextMenuInteraction,
  ): Promise<InteractionReplyOptions> {
    const machine = await this.nitrado.server();
    const server = await this.ark.server({
      host: machine.ip,
      port: machine.query_port,
    });
    console.log('FIELDS:');
    console.log([
      { name: 'Name', value: machine.settings.config['server-name'] },
      {
        name: 'Message of the day',
        value: machine.settings.config['message-of-the-day'],
      },
      { name: 'Ip address', value: machine.ip, inline: true },
      { name: 'Machine', value: machine.status, inline: true },
      { name: 'Server', value: server.status, inline: true },
      server.status === 'online' && Embed.getServerLinkEmbedField(machine),
    ]);
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
            { name: 'Name', value: machine.settings.config['server-name'] },
            {
              name: 'Message of the day',
              value: machine.settings.config['message-of-the-day'],
            },
            { name: 'Ip address', value: machine.ip },
            { name: 'Port', value: String(machine.query_port) },
            { name: 'Machine', value: machine.status, inline: true },
            { name: 'Server', value: server.status, inline: true },
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
