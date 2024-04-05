import { Column, Entity, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({
    default: false,
  })
  isDone: boolean;

  @Column({
    default: false,
  })
  isDeleted: boolean;

  @VersionColumn()
  version: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
