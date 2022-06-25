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
import { Embed } from '../components/embed';
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

    const { success, server, message, stoppingServerMessage } =
      await this.nitrado.stop(user.username, dto.message);

    return {
      embeds: [
        new MessageEmbed()
          .setTitle(server.game_human)
          .setColor(Embed.getColorForAPISuccess(success))
          .addFields([
            {
              name: 'Name',
              value: server.settings.config['server-name'],
            },
            { name: 'Message', value: message, inline: true },
            success && {
              name: 'Reason',
              value: stoppingServerMessage,
              inline: true,
            },
          ]),
      ],
    };
  }
}
