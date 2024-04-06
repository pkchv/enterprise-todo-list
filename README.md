# Enterprise Todo List

Fun playground for implementing microservice patterns in Nest.js while overengineering a Todo list.

## Tech stack

- Node.js
- TypeScript
- Nx
- Nest.js
- TypeORM
- Postgres
- RabbitMQ
- Docker

## Patterns implemented

- [Event sourcing](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing)
- [CQRS](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [Asynchronous Request-Reply](https://learn.microsoft.com/en-us/azure/architecture/patterns/async-request-reply) (job status of commands in CQRS)
- [Materialized Views](https://learn.microsoft.com/en-us/azure/architecture/patterns/materialized-view)
- [Pub/sub messaging](https://learn.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber)
- [Retry](https://learn.microsoft.com/en-us/azure/architecture/patterns/retry)

## Apps

### todos-api

API frontend / gateway implementing various strategies of interfacing with `todos-datastore`.

### todos-datastore

Implements a data storage and liberation layer for todos.

## Setup

```bash
git clone https://github.com/pkchv/enterprise-todo-list
cd enterprise-todo-list
npm i
```

## Build containers

```bash
nx run-many -t container
```

## Run containers

```bash
docker compose up
```
