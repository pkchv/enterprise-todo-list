import { Controller, Logger } from '@nestjs/common';

import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateTodoEventDto } from './dto/create-todo-event.dto';
import { DeleteTodoEventDto } from './dto/delete-todo-event.dto';
import { UpdateTodoEventDto } from './dto/update-todo-event.dto';
import { EventTransactionService } from './event-transaction.service';
import { transform } from './utility/transform';
import { validate } from './utility/validate';

// TODO: refactor validation and transformation

@Controller()
export class CommandsController {
  constructor(
    private readonly eventTransactionService: EventTransactionService
  ) {}

  @EventPattern('TODO_CREATED')
  async handleTodoCreatedEvent(@Payload() message, @Ctx() context: RmqContext) {
    Logger.log('Received event: TODO_CREATED');
    Logger.debug(`Message payload: ${JSON.stringify(message)}`);

    if (!validate(message, CreateTodoEventDto)) {
      Logger.error('Event validation failed: TODO_CREATED');
      context.getChannelRef().ack(context.getMessage());
      return;
    }

    const createTodoEvent = transform(message, CreateTodoEventDto);
    this.eventTransactionService.create(createTodoEvent);
    context.getChannelRef().ack(context.getMessage());
  }

  @EventPattern('TODO_UPDATED')
  async handleTodoUpdatedEvent(@Payload() message, @Ctx() context: RmqContext) {
    Logger.log('Received event: TODO_UPDATED');
    Logger.debug(`Message payload: ${JSON.stringify(message)}`);

    if (!validate(message, UpdateTodoEventDto)) {
      Logger.error('Received invalid TODO_UPDATED event');
      context.getChannelRef().ack(context.getMessage());
      return;
    }

    const updateTodoEvent = transform(message, UpdateTodoEventDto);
    this.eventTransactionService.update(updateTodoEvent);
    context.getChannelRef().ack(context.getMessage());
  }

  @EventPattern('TODO_DELETED')
  async handleTodoDeletedEvent(@Payload() message, @Ctx() context: RmqContext) {
    Logger.log('Received event: TODO_DELETED');
    Logger.debug(`Message payload: ${JSON.stringify(message)}`);

    if (!validate(message, DeleteTodoEventDto)) {
      Logger.error('Received invalid TODO_DELETED event');
      context.getChannelRef().ack(context.getMessage());
      return;
    }

    const deleteTodoEvent = transform(message, DeleteTodoEventDto);
    this.eventTransactionService.delete(deleteTodoEvent);
    context.getChannelRef().ack(context.getMessage());
  }
}
