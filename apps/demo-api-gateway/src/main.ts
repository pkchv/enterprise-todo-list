import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpApiModule } from './app/http-api.module';
import { EventHandlersModule } from './app/event-handlers.module';

async function bootstrap() {
  const url = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const queue = process.env.BROKER_QUEUE_EVENTS_NAME ?? 'todos-events';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EventHandlersModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    }
  );

  await app.listen();

  const http = await NestFactory.create(HttpApiModule);
  const globalPrefix = 'api';
  http.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await http.listen(port);
  Logger.log(
    `HTTP API is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
