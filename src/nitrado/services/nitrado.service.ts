import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NitradoService {
  private nitradoServiceId: string;
  private readonly logger = new Logger(NitradoService.name);

  constructor(
    private configService: ConfigService,
    private readonly http: HttpService,
  ) {
    this.nitradoServiceId = configService.get('NITRAPI_SERVICE_ID');
  }

  /**
   * Get server info
   */
  async server(): Promise<Nitrado.GameServer> {
    return (
      await firstValueFrom(this.http.get<Nitrado.ServerStatus>('/gameservers'))
    ).data.data.gameserver;
  }

  /**
   * Stop the server
   */
  async stop(
    user: string,
    message?: string,
  ): Promise<{
    success: boolean;
    message: string;
    stoppingServerMessage: string;
    server: Nitrado.GameServer;
  }> {
    const stoppingServerMessage = `${user}: ${
      message ?? 'arrêt du serveur via Discord'
    }`;
    const server = await this.server();

    if (server.status !== 'started') {
      const res = {
        success: false,
        message: `Cannot stop server, its current status is: ${server.status}`,
        stoppingServerMessage,
        server,
      };
      this.logger.warn('Server could not be stopped', res);
      return res;
    }

    const result = await firstValueFrom(
      this.http.post<Nitrado.StopServer>('/gameservers/stop', {
        message: stoppingServerMessage,
        stop_message: stoppingServerMessage,
      }),
    );

    const res = {
      success: true,
      message: result.data.message,
      stoppingServerMessage,
      server,
    };

    this.logger.log('Server stopped', res);
    return res;
  }

  /**
   * Start or restart server
   */
  async restart(
    user: string,
    message?: string,
  ): Promise<{
    success: boolean;
    message: string;
    restartingServerMessage: string;
    server: Nitrado.GameServer;
  }> {
    const restartingServerMessage = `${user}: ${
      message ?? 'redémarrage du serveur via Discord'
    }`;
    const server = await this.server();

    if (!['started', 'stopped'].includes(server.status)) {
      const res = {
        success: false,
        message: `Cannot restart server, its current status is: ${server.status}`,
        restartingServerMessage,
        server,
      };

      this.logger.warn('Server could not be restarted', res);
      return res;
    }

    const result = await firstValueFrom(
      this.http.post<Nitrado.RestartServer>('/gameservers/restart', {
        message: restartingServerMessage,
        stop_message: restartingServerMessage,
      }),
    );

    // this.notifyOnceReady().catch((e) => console.error(e));
    const res = {
      success: true,
      message: result.data.message,
      restartingServerMessage,
      server,
    };

    this.logger.log('Server restarted', res);
    return res;
  }

  private async notifyOnceReady() {
    const checkReady = setTimeout(async () => {
      const server = await this.server();
      if (server.status === 'started') {
        clearTimeout(checkReady);
        // TODO: notification server is started
      }
    }, 30_000);
  }
}
