import { Param } from '@discord-nestjs/core';

export class StopDto {
  @Param({
    name: 'message',
    description: 'Message to add to the stopping server reason',
    required: false,
  })
  message: string;
}
