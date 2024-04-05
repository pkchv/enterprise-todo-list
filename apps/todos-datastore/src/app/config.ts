export default () => ({
  port: parseInt(process.env.PORT, 10) ?? 3000,
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    username: process.env.DATABASE_USERNAME ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'postgres',
    database: process.env.DATABASE_NAME ?? 'datastore',
    port: parseInt(process.env.DATABASE_PORT, 10) ?? 5432,
  },
  broker: {
    service: process.env.BROKER_SERVICE ?? 'api-gateway',
    url: process.env.BROKER_URL ?? 'amqp://localhost:5672',
    queue_commands: process.env.BROKER_QUEUE_COMMANDS_NAME ?? 'todos-commands',
    queue_events: process.env.BROKER_QUEUE_EVENTS_NAME ?? 'todos-events',
  },
});
