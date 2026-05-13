import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Garantiza que toda respuesta saliente del API tenga el shape
 * `{ data, meta? }`. Si el controlador ya devuelve esa forma, se respeta.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((body) => {
        if (body && typeof body === 'object' && 'data' in (body as object)) {
          return body;
        }
        return { data: body };
      }),
    );
  }
}
