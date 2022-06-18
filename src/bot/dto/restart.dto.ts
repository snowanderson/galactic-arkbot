import { Param } from '@discord-nestjs/core';

export class RestartDto {
  @Param({
    name: 'message',
    description:
      'Message to add to the starting or restarting server reason',
    required: false,
  })
  message: string;
}
