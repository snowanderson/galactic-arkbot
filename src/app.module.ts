import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Intents } from 'discord.js';

import { BotModule } from './bot/bot.module';
import { ArkModule } from './ark/ark.module';
import { CronService } from './cron/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NitradoModule } from './nitrado/nitrado.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    BotModule,
    NitradoModule,
    ArkModule,
    ScheduleModule.forRoot(),
  ],
  providers: [CronService],
})
export class AppModule {}
