import { Test, TestingModule } from '@nestjs/testing';
import { CointossService } from './cointoss.service';

describe('CointossService', () => {
  let service: CointossService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CointossService],
    }).compile();

    service = module.get<CointossService>(CointossService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
