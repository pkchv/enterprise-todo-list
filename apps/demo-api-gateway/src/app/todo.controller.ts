import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateTodoDto } from './dto/create-todo.dto';
import { DeleteTodoDto } from './dto/delete-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JobStatusService } from './job-status.service';
import { JobStatus } from './models/job-status.model';
import { Todo } from './models/todo.model';
import { TodoCommandsService } from './todo-commands.service';
import { TodoService } from './todo.service';

@Controller('todos')
@UsePipes(new ValidationPipe({ transform: true }))
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly todoCommandsService: TodoCommandsService,
    private readonly jobStatusService: JobStatusService
  ) {}

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
    )
    id: number
  ): Promise<Todo> {
    const todo = this.todoService.findOne(id);

    if (todo === null) {
      throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
    }

    return todo;
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async create(@Body() createTodoDto: CreateTodoDto) {
    const status = await this.todoCommandsService.create(createTodoDto);
    await this.jobStatusService.create(status.id);
    return status;
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Body() updateTodoDto: UpdateTodoDto) {
    const status = await this.todoCommandsService.update(updateTodoDto);
    await this.jobStatusService.create(status.id);
    return status;
  }

  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Body() deleteTodoDto: DeleteTodoDto) {
    const status = await this.todoCommandsService.delete(deleteTodoDto);
    await this.jobStatusService.create(status.id);
    return status;
  }

  @Get('status/:id')
  async getStatus(@Param('id') id: string): Promise<JobStatus> {
    const jobStatus = await this.jobStatusService.findOne(id);

    if (jobStatus === null) {
      throw new HttpException('Job status not found', HttpStatus.NOT_FOUND);
    }

    return jobStatus;
  }
}
