import { Test, TestingModule } from '@nestjs/testing';
import { NitradoService } from './nitrado.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

describe('NitradoService', () => {
  let service: NitradoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [NitradoService],
    }).compile();

    service = module.get<NitradoService>(NitradoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
