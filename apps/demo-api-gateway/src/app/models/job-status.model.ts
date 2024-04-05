import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class JobStatus {
  @PrimaryColumn()
  jobId: string;

  @Column({
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
  })
  status: string;

  @Column({
    nullable: true,
  })
  error: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
