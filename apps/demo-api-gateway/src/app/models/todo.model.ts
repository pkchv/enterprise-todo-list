import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  isDone: boolean;

  @Column()
  isDeleted: boolean;

  @Column()
  version: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
