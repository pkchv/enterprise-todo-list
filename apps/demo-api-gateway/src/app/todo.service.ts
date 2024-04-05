import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventDto } from './dto/event.dto';
import { Todo } from './models/todo.model';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Todo> {
    return this.todoRepository.findOneBy({ id });
  }

  async upsert(todo: Todo): Promise<void> {
    await this.todoRepository.upsert(todo, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['id'],
    });
  }

  static createFromEvent({
    id,
    description,
    isDone,
    isDeleted,
    version,
    createdAt,
    updatedAt,
  }: EventDto) {
    const todo = new Todo();
    Object.assign(todo, {
      id,
      description,
      isDone,
      isDeleted,
      version,
      createdAt,
      updatedAt,
    });

    return todo;
  }
}
