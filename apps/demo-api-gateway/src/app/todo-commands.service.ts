import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { DeleteTodoDto } from './dto/delete-todo.dto';
import { JobStatusDto } from './dto/job-status.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueueClientService } from './queue-client.service';

@Injectable()
export class TodoCommandsService {
  constructor(private readonly commandsClient: QueueClientService) {}

  async create(dto: CreateTodoDto): Promise<JobStatusDto> {
    return this.commandsClient.publish('TODO_CREATED', dto);
  }

  async update(dto: UpdateTodoDto): Promise<JobStatusDto> {
    return this.commandsClient.publish('TODO_UPDATED', dto);
  }

  async delete(dto: DeleteTodoDto): Promise<JobStatusDto> {
    return this.commandsClient.publish('TODO_DELETED', dto);
  }
}
