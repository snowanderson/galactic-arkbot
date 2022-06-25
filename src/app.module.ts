import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BotModule } from './bot/bot.module';
import { ArkModule } from './ark/ark.module';
import { CronService } from './cron/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NitradoModule } from './nitrado/nitrado.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BotModule,
    NitradoModule,
    ArkModule,
    ScheduleModule.forRoot(),
  ],
  providers: [CronService],
})
export class AppModule {}
