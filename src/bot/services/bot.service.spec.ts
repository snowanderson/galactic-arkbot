import { Test, TestingModule } from '@nestjs/testing';
import { BotService } from './bot.service';
import { NitradoModule } from '../../nitrado/nitrado.module';
import { ArkModule } from '../../ark/ark.module';
import { StatusCommand } from '../commands/status.command';
import { StopCommand } from '../commands/stop.command';
import { RestartCommand } from '../commands/restart.command';
import { BotModule } from '../bot.module';

describe('BotService', () => {
  let service: BotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NitradoModule, ArkModule, BotModule],
      providers: [StatusCommand, StopCommand, RestartCommand],
    }).compile();

    service = module.get<BotService>(BotService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
