import { IsString } from 'class-validator';

export class CreateTodoEventDto {
  @IsString()
  eventId: string;

  @IsString()
  description: string;
}
