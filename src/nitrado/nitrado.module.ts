import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { NitradoService } from './services/nitrado.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        baseURL: `https://api.nitrado.net/services/${configService.get(
          'NITRAPI_SERVICE_ID',
        )}`,
        headers: {
          ContentType: 'application/json',
          Authorization: `Bearer ${configService.get('NITRAPI_TOKEN')}`,
          'User-Agent': `nitrado.js/${configService.get('NITRAPI_VERSION')}`,
        },
      }),
    }),
  ],
  providers: [NitradoService],
  exports: [NitradoService],
})
export class NitradoModule {}
