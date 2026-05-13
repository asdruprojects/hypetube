import { ApiProperty } from '@nestjs/swagger';

export class HealthSchema {
  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({ example: '2026-05-13T01:55:57.047Z' })
  timestamp!: string;
}

export class HealthResponseSchema {
  @ApiProperty({ type: HealthSchema })
  data!: HealthSchema;
}
