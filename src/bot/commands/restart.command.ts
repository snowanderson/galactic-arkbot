import { TransformPipe } from '@discord-nestjs/common';
import {
  Command,
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';

import { InteractionReplyOptions, MessageEmbed } from 'discord.js';
import { RestartDto } from '../dto/restart.dto';
import { NitradoService } from '../../nitrado/services/nitrado.service';

@Command({
  name: 'restart',
  description: 'Start or restart the server',
})
@UsePipes(TransformPipe)
export class RestartCommand implements DiscordTransformedCommand<RestartDto> {
  constructor(private nitrado: NitradoService) {}

  async handler(
    @Payload() dto: RestartDto,
    { interaction }: TransformedCommandExecutionContext,
  ): Promise<InteractionReplyOptions> {
    const { user } = interaction;

    const { success, message, restartingServerMessage } =
      await this.nitrado.restart(user.username, dto.message);

    const embed = new MessageEmbed();

    return {
      embeds: [
        success
          ? embed
              .setTitle(message)
              .setColor('BLUE')
              .setDescription(restartingServerMessage)
          : embed
              .setTitle('Echec du (re)démarrage')
              .setColor('RED')
              .setDescription("Le serveur n'a pas pu (re)démarrer"),
      ],
    };
  }
}
