import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArkService } from '../ark/services/ark.service';
import { BotService } from '../bot/services/bot.service';
import { Embed } from '../bot/components/embed';
import { MessageEmbed } from 'discord.js';
import { NitradoService } from '../nitrado/services/nitrado.service';
import { GameServer } from 'Nitrado';
import * as Ark from 'Ark';

@Injectable()
export class CronService {
  private machineStatus: GameServer['status'];
  private arkStatus: Ark.ArkServerStatus['status'];

  private readonly logger = new Logger(CronService.name);

  constructor(
    private ark: ArkService,
    private nitrado: NitradoService,
    private bot: BotService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    this.logger.log('Executing cron...');

    const embeds: Embed[] = [];

    const machine = await this.nitrado.server();
    const server = await this.ark.server({
      host: machine.ip,
      port: machine.query_port,
    });

    if (this.arkStatus && this.arkStatus !== server.status) {
      embeds.push(
        this.arkStatus === 'online'
          ? new MessageEmbed()
              .setTitle('Serveur en ligne !')
              .setColor('GREEN')
              .setDescription(
                `Le serveur Ark est maintenant joignable.\n\nCliquez sur ce lien pour rejoindre: ${
                  Embed.getServerLinkEmbedField(machine).value
                }`,
              )
          : new MessageEmbed()
              .setTitle('Serveur hors ligne !')
              .setColor('RED')
              .setDescription('Le serveur Ark est maintenant hors ligne.'),
      );
    }

    if (this.machineStatus && this.machineStatus !== machine.status) {
      embeds.push(this.getEmbedForServerStatus(this.machineStatus));
    }

    this.machineStatus = machine.status;
    this.arkStatus = server.status;

    if (embeds.length) {
      await this.bot.sendMessage({
        embeds,
      });
    }

    this.bot.setStatus(this.arkStatus);
  }

  private getEmbedForServerStatus(status: GameServer['status']) {
    const embed = new MessageEmbed().setTitle('Nitrado');

    switch (status) {
      case 'started':
        return embed
          .setColor('GREEN')
          .setDescription('La machine est démarrée');
      case 'stopped':
        return embed.setColor('RED').setDescription('La machine est arrêtée');
      case 'restarting':
        return embed
          .setColor('ORANGE')
          .setDescription('La machine est en cours de (re)démarrage');
      case 'stopping':
        return embed
          .setColor('ORANGE')
          .setDescription("La machine est en cours d'arrêt");
      case 'backup_creation':
        return embed
          .setColor('ORANGE')
          .setDescription('Backup en cours de création');
      case 'backup_restore':
        return embed
          .setColor('ORANGE')
          .setDescription('Backup en cours de restauration');
      case 'suspended':
        return embed.setColor('RED').setDescription('La machine est suspendue');
      default:
        return embed
          .setColor('RED')
          .setDescription(`Status du serveur inconnu : ${status}`);
    }
  }
}
