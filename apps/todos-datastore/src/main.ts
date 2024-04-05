// Note: for generatePackageJson flag to work properly with dynamically imported postgres driver
import 'pg';
import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const url = process.env.BROKER_URL ?? 'amqp://localhost:5672';
  const queue = process.env.BROKER_QUEUE_COMMANDS_NAME ?? 'todos-commands';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
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
  Logger.log(`🚀 App is running`);
}

bootstrap();
