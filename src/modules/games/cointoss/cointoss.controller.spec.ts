import { Test, TestingModule } from '@nestjs/testing';
import { CointossController } from './cointoss.controller';

describe('CointossController', () => {
  let controller: CointossController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CointossController],
    }).compile();

    controller = module.get<CointossController>(CointossController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
