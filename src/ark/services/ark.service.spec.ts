import { Test, TestingModule } from '@nestjs/testing';
import { ArkService } from './ark.service';

describe('ArkService', () => {
  let service: ArkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArkService],
    }).compile();

    service = module.get<ArkService>(ArkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
