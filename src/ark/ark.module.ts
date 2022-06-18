import { Module } from '@nestjs/common';
import { ArkService } from './services/ark.service';

@Module({
  providers: [ArkService],
  exports: [ArkService],
})
export class ArkModule {}
