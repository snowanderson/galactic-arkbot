import { Injectable, Logger } from '@nestjs/common';
import * as Gamedig from 'gamedig';
import type * as Ark from 'Ark';

@Injectable()
export class ArkService {
  private readonly logger = new Logger(ArkService.name);

  async server({
    host,
    port,
  }: {
    host: string;
    port: number;
  }): Promise<Ark.ArkServerStatus> {
    try {
      const server = await Gamedig.query({
        type: 'arkse',
        host,
        port,
      });
      return {
        status: 'online',
        server,
      };
    } catch (e) {
      this.logger.log('ark server query failed', e);
      return {
        status: 'offline',
      };
    }
  }
}
