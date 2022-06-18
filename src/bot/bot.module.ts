import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';

import { StatusCommand } from './commands/status.command';
import { NitradoModule } from '../nitrado/nitrado.module';
import { StopCommand } from './commands/stop.command';
import { RestartCommand } from './commands/restart.command';
import { BotService } from './services/bot.service';
import { ArkModule } from '../ark/ark.module';

@Module({
  imports: [DiscordModule.forFeature(), NitradoModule, ArkModule],
  providers: [StatusCommand, StopCommand, RestartCommand, BotService],
  exports: [BotService],
})
export class BotModule {}
