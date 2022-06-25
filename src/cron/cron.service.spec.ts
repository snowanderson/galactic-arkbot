import { Test, TestingModule } from '@nestjs/testing';
import { CronService } from './cron.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BotModule } from '../bot/bot.module';
import { ArkModule } from '../ark/ark.module';
import { NitradoModule } from '../nitrado/nitrado.module';

describe('CronService', () => {
  let service: CronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, BotModule, ArkModule, NitradoModule, ConfigModule],
      providers: [CronService],
    }).compile();

    service = module.get<CronService>(CronService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
