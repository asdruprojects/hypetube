import { ApiProperty } from '@nestjs/swagger';

/**
 * Wrapper genérico que el ResponseInterceptor aplica a toda respuesta exitosa.
 * Sólo existe para que Swagger documente el shape `{ data: ... }`.
 */
export class ApiErrorBody {
  @ApiProperty({ example: 'VALIDATION_FAILED' })
  code!: string;

  @ApiProperty({ example: 'sortBy must be one of the following values: hype, views, likes, comments, newest' })
  message!: string;

  @ApiProperty({ required: false, type: Object, nullable: true })
  details?: unknown;
}

export class ApiErrorResponseSchema {
  @ApiProperty({ type: ApiErrorBody })
  error!: ApiErrorBody;
}
