import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTodoEventDto {
  @IsString()
  eventId: string;

  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isDone: boolean;
}
