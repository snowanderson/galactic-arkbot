import { TransformPipe } from '@discord-nestjs/common';
import {
  Command,
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';

import { InteractionReplyOptions, MessageEmbed } from 'discord.js';
import { StopDto } from '../dto/stop.dto';
import { NitradoService } from '../../nitrado/services/nitrado.service';

@Command({
  name: 'stop',
  description: 'Stop the server',
})
@UsePipes(TransformPipe)
export class StopCommand implements DiscordTransformedCommand<StopDto> {
  constructor(private nitrado: NitradoService) {}

  async handler(
    @Payload() dto: StopDto,
    { interaction }: TransformedCommandExecutionContext,
  ): Promise<InteractionReplyOptions> {
    const { user } = interaction;

    const { success, message, stoppingServerMessage } = await this.nitrado.stop(
      user.username,
      dto.message,
    );

    const embed = new MessageEmbed();

    return {
      embeds: [
        success
          ? embed
              .setTitle(message)
              .setColor('BLUE')
              .setDescription(stoppingServerMessage)
          : embed
              .setTitle("Echec de l'arrêt")
              .setColor('RED')
              .setDescription("Le serveur n'a pas pu s'arréter"),
      ],
    };
  }
}
