import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';

import { StatusCommand } from './commands/status.command';
import { NitradoModule } from '../nitrado/nitrado.module';
import { StopCommand } from './commands/stop.command';
import { RestartCommand } from './commands/restart.command';
import { BotService } from './services/bot.service';
import { ArkModule } from '../ark/ark.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Intents } from 'discord.js';

@Module({
  imports: [
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get('TOKEN'),
        discordClientOptions: {
          intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
        },
        webhook: {
          url: configService.get('WEBHOOK_URL'),
        },
        registerCommandOptions: [
          {
            forGuild: configService.get('GUILD_ID_WITH_COMMANDS'),
            removeCommandsBefore: true,
          },
        ],
      }),
      inject: [ConfigService],
    }),
    NitradoModule,
    ArkModule,
  ],
  providers: [StatusCommand, StopCommand, RestartCommand, BotService],
  exports: [BotService],
})
export class BotModule {}
