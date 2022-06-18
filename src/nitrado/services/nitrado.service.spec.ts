import { Test, TestingModule } from '@nestjs/testing';
import { NitradoService } from './nitrado.service';

describe('NitradoService', () => {
  let service: NitradoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NitradoService],
    }).compile();

    service = module.get<NitradoService>(NitradoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
