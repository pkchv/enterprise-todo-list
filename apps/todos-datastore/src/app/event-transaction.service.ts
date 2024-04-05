import { Injectable, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { CreateTodoEventDto } from './dto/create-todo-event.dto';
import { DeleteTodoEventDto } from './dto/delete-todo-event.dto';
import { UpdateTodoEventDto } from './dto/update-todo-event.dto';
import { Event } from './models/event.model';
import { Outbox } from './models/outbox.model';
import { Todo } from './models/todo.model';

@Injectable()
export class EventTransactionService {
  constructor(private readonly dataSource: DataSource) {}

  async create({ eventId, description }: CreateTodoEventDto) {
    await this.runTransaction(eventId, async (queryRunner) => {
      const eventType = 'TODO_CREATED';
      const eventTimestamp = new Date();

      let todo = new Todo();
      todo.description = description;
      todo.updatedAt = eventTimestamp;
      todo.createdAt = eventTimestamp;

      todo = await queryRunner.manager.save(todo);

      const event = new Event();
      Object.assign<Event, Partial<Event>>(event, todo);
      Object.assign<Event, Partial<Event>>(event, {
        eventId,
        eventType,
        eventTimestamp,
      });

      const outbox = new Outbox();
      Object.assign<Outbox, Event>(outbox, event);

      await queryRunner.manager.save(event);
      await queryRunner.manager.save(outbox);
    });
  }

  async update({ eventId, id, description, isDone }: UpdateTodoEventDto) {
    await this.runTransaction(eventId, async (queryRunner) => {
      const eventType = 'TODO_UPDATED';
      const eventTimestamp = new Date();

      const todo = await queryRunner.manager.findOne(Todo, { where: { id } });

      if (!todo) {
        throw new Error('Todo not found');
      }

      Object.assign<Todo, Partial<Todo>>(todo, {
        description,
        isDone,
        updatedAt: eventTimestamp,
      });

      const event = new Event();
      Object.assign<Event, Partial<Event>>(event, todo);
      Object.assign<Event, Partial<Event>>(event, {
        eventId,
        eventType,
        eventTimestamp,
      });

      const outbox = new Outbox();
      Object.assign<Outbox, Event>(outbox, event);

      await queryRunner.manager.save(todo);
      await queryRunner.manager.save(event);
      await queryRunner.manager.save(outbox);
    });
  }

  async delete({ eventId, id }: DeleteTodoEventDto) {
    await this.runTransaction(eventId, async (queryRunner) => {
      const eventType = 'TODO_DELETED';
      const eventTimestamp = new Date();

      const todo = await queryRunner.manager.findOne(Todo, { where: { id } });

      if (!todo) {
        throw new Error('Todo not found');
      }

      Object.assign<Todo, Partial<Todo>>(todo, {
        isDeleted: true,
        updatedAt: eventTimestamp,
      });

      const event = new Event();
      Object.assign<Event, Partial<Event>>(event, todo);
      Object.assign<Event, Partial<Event>>(event, {
        eventId,
        eventType,
        eventTimestamp,
      });

      const outbox = new Outbox();
      Object.assign<Outbox, Event>(outbox, event);

      await queryRunner.manager.save(todo);
      await queryRunner.manager.save(event);
      await queryRunner.manager.save(outbox);
    });
  }

  async error({ eventId, error }: { eventId: string; error: string }) {
    await this.runTransaction(eventId, async (queryRunner) => {
      const eventType = 'TODO_ERROR';
      const eventTimestamp = new Date();

      const event = new Event();
      Object.assign<Event, Partial<Event>>(event, {
        eventId,
        eventType,
        error,
        eventTimestamp,
      });

      const outbox = new Outbox();
      Object.assign<Outbox, Event>(outbox, event);

      await queryRunner.manager.save(event);
      await queryRunner.manager.save(outbox);
    });
  }

  private async runTransaction(
    eventId: string,
    transactionCallback: (queryRunner: QueryRunner) => Promise<void>
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let error = null;

    try {
      await transactionCallback(queryRunner);
      await queryRunner.commitTransaction();

      Logger.log('Transaction committed successfully 🎉');
    } catch (err) {
      error = err;
      Logger.error(`Transaction failed: ${err}`);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    if (error) {
      await this.error({
        eventId,
        error: error.message,
      });
    }
  }
}
