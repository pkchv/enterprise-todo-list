import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { instanceToPlain } from 'class-transformer';
import { firstValueFrom, timeout } from 'rxjs';
import { Event } from './models/event.model';

@Injectable()
export class EventsClientService {
  constructor(@Inject('queue-events') private readonly client: ClientProxy) {}

  async publish(event: Event) {
    const message = instanceToPlain(event);
    Logger.log(`Publishing event: ${JSON.stringify(message)}`);

    await firstValueFrom(
      this.client.emit(event.eventType, message).pipe(timeout(5000))
    );
  }
}
