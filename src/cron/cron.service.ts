import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArkService } from '../ark/services/ark.service';
import { BotService } from '../bot/services/bot.service';
import { Embed } from '../bot/components/embed';
import { MessageEmbed } from 'discord.js';
import { NitradoService } from '../nitrado/services/nitrado.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private ark: ArkService,
    private nitrado: NitradoService,
    private bot: BotService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    this.logger.log('Executing cron...');
    const machine = await this.nitrado.server();
    const server = await this.ark.server({
      host: machine.ip,
      port: machine.query_port,
    });
    if (this.bot.status !== server.status) {
      this.bot.setStatus(server.status);
      const embed: Embed = new MessageEmbed()
        .setTitle(machine.game_human)
        .setColor(
          Embed.getColorForMachineAndServerStatus({
            machineStatus: machine.status,
            serverStatus: server.status,
          }),
        )
        .addFields([
          { name: 'Status', value: `Server is now ${server.status}` },
          { name: 'Machine', value: machine.status },
          ...(server.status === 'online'
            ? [Embed.getServerLinkEmbedField(machine)]
            : []),
        ]);
      await this.bot.sendMessage({
        embeds: [embed],
      });
    }
  }
}
