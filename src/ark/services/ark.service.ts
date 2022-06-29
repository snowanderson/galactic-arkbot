import { Injectable, Logger } from '@nestjs/common';
import * as Gamedig from 'gamedig';
import type * as Ark from 'Ark';

/** Message received by GameDig when trying to query an unreachable server */
const FAILED_ATTEMPT_MESSAGE = 'Failed all 1 attempts';

@Injectable()
export class ArkService {
  status: Ark.ArkServerStatus;

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
      if (e.message !== FAILED_ATTEMPT_MESSAGE) {
        this.logger.error('ark server query failed', e);
      }
      return {
        status: 'offline',
      };
    }
  }
}
