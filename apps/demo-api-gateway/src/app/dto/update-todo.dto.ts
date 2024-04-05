import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isDone: boolean;
}
