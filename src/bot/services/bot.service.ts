import { Injectable, Logger } from '@nestjs/common';
import { DiscordClientProvider, Once } from '@discord-nestjs/core';
import { MessagePayload, WebhookMessageOptions } from 'discord.js';

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
    this.getStatus();
  }

  getStatus() {
    const activities =
      this.discordProvider.getClient().user.presence.activities;
    if (activities.length) {
      const status = activities[0].name.replace('server: ', '');
      if (!BotService.statusIsServerStatus(status)) {
        this.logger.error('Incorrect server status', { status });
        throw new Error('Incorrect server status');
      }
      this.status = status;
      return status;
    }
    return undefined;
  }

  setStatus(serverStatus: Ark.ArkServerStatus['status']) {
    this.discordProvider
      .getClient()
      .user.setActivity(`server: ${serverStatus}`, {
        type: 'WATCHING',
      });
    this.status = serverStatus;
  }

  async sendMessage(options: string | MessagePayload | WebhookMessageOptions) {
    await this.discordProvider.getWebhookClient().send(options);
  }

  private static statusIsServerStatus(
    status: string,
  ): status is Ark.ArkServerStatus['status'] {
    return ['online', 'offline'].includes(status);
  }
}
