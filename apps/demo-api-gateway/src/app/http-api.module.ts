import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { Todo } from './models/todo.model';
import { QueueClientService } from './queue-client.service';
import { TodoCommandsService } from './todo-commands.service';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { JobStatus } from './models/job-status.model';
import { JobStatusService } from './job-status.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [Todo, JobStatus],
        // Note: not recommended for production
        synchronize: true,
      }),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'queue-commands',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get('broker.url') as RmqUrl],
              queue: configService.get('broker.queue_commands'),
              noAck: true,
              queueOptions: {
                durable: true,
              },
            },
          }),
        },
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Todo, JobStatus]),
  ],
  controllers: [TodoController],
  providers: [
    TodoService,
    TodoCommandsService,
    QueueClientService,
    JobStatusService,
  ],
})
export class HttpApiModule {}
