import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EventDto {
  @IsString()
  eventId: string;

  @IsString()
  eventType: string;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  eventTimestamp: Date;

  @IsOptional()
  @IsString()
  error: string;

  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isDone: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;

  @IsOptional()
  @IsNumber()
  version: number;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  createdAt: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  updatedAt: Date;
}
