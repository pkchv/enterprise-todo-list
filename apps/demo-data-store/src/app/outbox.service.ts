import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsClientService } from './events-client.service';
import { Outbox } from './models/outbox.model';

@Injectable()
export class OutboxService {
  constructor(
    @InjectRepository(Outbox)
    private readonly outboxRepository: Repository<Outbox>,
    private readonly eventsClient: EventsClientService
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handleOutbox() {
    const events = await this.outboxRepository.find({
      order: { createdAt: 'ASC' },
    });

    for (const event of events) {
      Logger.log(
        `Publishing event ${event.eventId} created at ${event.createdAt}`
      );

      await this.eventsClient.publish(event);
      await this.outboxRepository.remove(event);
    }
  }
}
