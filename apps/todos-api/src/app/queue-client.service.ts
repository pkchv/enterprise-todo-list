import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { JobStatusDto } from './dto/job-status.dto';
import { createUniqueId } from './utility/create-unique-id';

@Injectable()
export class QueueClientService {
  constructor(@Inject('queue-commands') private client: ClientProxy) {}

  async publish(
    eventType: 'TODO_CREATED' | 'TODO_UPDATED' | 'TODO_DELETED',
    data
  ) {
    const eventId = createUniqueId();
    const jobStatus = new JobStatusDto();
    jobStatus.id = eventId;
    const message = Object.assign({}, data, { eventId });

    Logger.log(`Publishing event: ${JSON.stringify(message)}`);

    await firstValueFrom(
      this.client.emit(eventType, message).pipe(timeout(5000))
    );

    return jobStatus;
  }
}
