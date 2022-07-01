import { TransformPipe } from '@discord-nestjs/common';
import { Command, DiscordCommand, UsePipes } from '@discord-nestjs/core';

import {
  // ContextMenuInteraction,
  InteractionReplyOptions,
  MessageEmbed,
} from 'discord.js';
import { NitradoService } from '../../nitrado/services/nitrado.service';
import { ArkService } from '../../ark/services/ark.service';

@Command({
  name: 'players',
  description: 'Get online players list',
})
@UsePipes(TransformPipe)
export class PlayersCommand implements DiscordCommand {
  constructor(private nitrado: NitradoService, private ark: ArkService) {}

  async handler(): Promise<InteractionReplyOptions> {
    const machine = await this.nitrado.server();
    const server = await this.ark.server({
      host: machine.ip,
      port: machine.query_port,
    });

    if (server.status === 'online') {
      const playersList = server.server.players.length
        ? server.server.players
            .map((p) => p.name ?? 'En cours de connexion...')
            .join('\n- ')
        : 'Aucun joueurs connectés.';
      return {
        embeds: [
          new MessageEmbed()
            .setTitle('Joueurs en ligne')
            .setColor('BLUE')
            .setDescription(playersList),
        ],
      };
    }

    return {
      embeds: [
        new MessageEmbed()
          .setTitle('Joueurs en ligne')
          .setColor('RED')
          .setDescription('Le serveur est hors ligne.'),
      ],
    };
  }
}
