import { Controller, Logger } from '@nestjs/common';

import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { EventDto } from './dto/event.dto';
import { JobStatusService } from './job-status.service';
import { TodoService } from './todo.service';
import { transform } from './utility/transform';

// TODO: refactor validation and transformation

@Controller()
export class EventsController {
  constructor(
    private readonly todoService: TodoService,
    private readonly jobStatus: JobStatusService
  ) {}

  @EventPattern('TODO_CREATED')
  async handleTodoCreatedEvent(@Payload() message, @Ctx() context: RmqContext) {
    Logger.debug(`Received TODO_CREATED event: ${JSON.stringify(message)}`);

    if (!validate(message, EventDto)) {
      Logger.error('Event validation failed for TODO_CREATED event');
      context.getChannelRef().ack(context.getMessage());
      return;
    }

    const event = transform(message, EventDto);
    const todo = TodoService.createFromEvent(event);
    await this.todoService.upsert(todo);

    context.getChannelRef().ack(context.getMessage());
  }

  @EventPattern('TODO_UPDATED')
  async handleTodoUpdatedEvent(@Payload() message, @Ctx() context: RmqContext) {
    Logger.debug(`Received TODO_UPDATED event: ${JSON.stringify(message)}`);

    if (!validate(message, EventDto)) {
      Logger.error('Event validation failed for TODO_UPDATED event');
      context.getChannelRef().ack(context.getMessage());
      return;
    }

    const event = transform(message, EventDto);
    const todo = TodoService.createFromEvent(event);
    await this.todoService.upsert(todo);

    context.getChannelRef().ack(context.getMessage());
  }

  @EventPattern('TODO_DELETED')
  async handleTodoDeletedEvent(@Payload() message, @Ctx() context: RmqContext) {
    Logger.debug(`Received TODO_DELETED event: ${JSON.stringify(message)}`);

    if (!validate(message, EventDto)) {
      Logger.error('Event validation failed for TODO_DELETED event');
      context.getChannelRef().ack(context.getMessage());
      return;
    }

    const event = transform(message, EventDto);
    const todo = TodoService.createFromEvent(event);
    await this.todoService.upsert(todo);

    context.getChannelRef().ack(context.getMessage());
  }

  @EventPattern('TODO_ERROR')
  async handleTodoErrorEvent(@Payload() message, @Ctx() context: RmqContext) {
    Logger.debug(`Received TODO_ERROR event: ${JSON.stringify(message)}`);

    if (!validate(message, EventDto)) {
      Logger.error('Event validation failed for TODO_ERROR event');
      context.getChannelRef().ack(context.getMessage());
      return;
    }

    const event = transform(message, EventDto);
    const jobStatus = JobStatusService.createFromEvent(event);
    await this.jobStatus.save(jobStatus);

    context.getChannelRef().ack(context.getMessage());
  }
}
