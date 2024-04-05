import { IsNumber, IsString } from 'class-validator';

export class DeleteTodoEventDto {
  @IsString()
  eventId: string;

  @IsNumber()
  id: number;
}
