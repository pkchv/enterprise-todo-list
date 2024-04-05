import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Event } from './event.model';
import { Transform } from 'class-transformer';

@Entity()
export class Outbox implements Event {
  @PrimaryColumn()
  eventId: string;

  @Column({
    type: 'enum',
    enum: ['TODO_CREATED', 'TODO_UPDATED', 'TODO_DELETED', 'TODO_ERROR'],
  })
  eventType: 'TODO_CREATED' | 'TODO_UPDATED' | 'TODO_DELETED' | 'TODO_ERROR';

  @Column({
    nullable: true,
  })
  @Transform(({ value }: { value: Date }) => value?.toISOString(), {
    toPlainOnly: true,
  })
  eventTimestamp: Date;

  @Column({
    nullable: true,
  })
  error: string;

  @Column({
    nullable: true,
  })
  id: number;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  isDone: boolean;

  @Column({
    nullable: true,
  })
  isDeleted: boolean;

  @Column({
    nullable: true,
  })
  version: number;

  @Column({
    nullable: true,
  })
  @Transform(({ value }: { value: Date }) => value?.toISOString(), {
    toPlainOnly: true,
  })
  createdAt: Date;

  @Column({
    nullable: true,
  })
  @Transform(({ value }: { value: Date }) => value?.toISOString(), {
    toPlainOnly: true,
  })
  updatedAt: Date;
}
