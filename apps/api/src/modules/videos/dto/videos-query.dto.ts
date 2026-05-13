import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  SORT_ORDERS,
  VIDEO_SORT_FIELDS,
  type SortOrder,
  type VideoSortField,
} from '@hypetube/contracts';

/**
 * Acepta valores comunes para boolean (string "true"/"false", 1/0).
 * Mantenemos esta lógica aquí para que el controlador reciba el tipo nativo.
 */
function toBool({ value }: { value: unknown }): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  const v = String(value).toLowerCase();
  if (v === 'true' || v === '1' || v === 'yes') return true;
  if (v === 'false' || v === '0' || v === 'no') return false;
  return undefined;
}

export class VideosQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  search?: string;

  @IsOptional()
  @IsIn(VIDEO_SORT_FIELDS as unknown as string[])
  sortBy?: VideoSortField;

  @IsOptional()
  @IsIn(SORT_ORDERS as unknown as string[])
  order?: SortOrder;

  @IsOptional()
  @IsBoolean()
  @Transform(toBool)
  tutorialsOnly?: boolean;
}
