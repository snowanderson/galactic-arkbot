import { Injectable, Logger } from '@nestjs/common';
import { DiscordClientProvider, Once } from '@discord-nestjs/core';
import { MessagePayload, WebhookMessageOptions } from 'discord.js';
import { format } from 'date-fns';
import type * as Ark from 'Ark';
import { greenCheck, redCross } from '../../utils/emojis';

@Injectable()
export class BotService {
  status: Ark.ArkServerStatus['status'];
  private readonly logger = new Logger(BotService.name);

  constructor(private readonly discordProvider: DiscordClientProvider) {}

  @Once('ready')
  onReady(): void {
    this.logger.log(
      `Logged in as ${this.discordProvider.getClient().user.tag}!`,
    );
  }

  setStatus(serverStatus: Ark.ArkServerStatus['status']) {
    const emoji = serverStatus === 'online' ? greenCheck : redCross;
    const lastUpdate = format(new Date(), 'dd/MM/yyyy HH:mm:ss');

    this.discordProvider
      .getClient()
      .user.setActivity(`serveur: ${emoji} (${lastUpdate})`, {
        type: 'WATCHING',
      });
  }

  async sendMessage(options: string | MessagePayload | WebhookMessageOptions) {
    await this.discordProvider.getWebhookClient().send(options);
  }
}
