import { IsNumber } from 'class-validator';

export class DeleteTodoDto {
  @IsNumber()
  id: number;
}
