import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventDto } from './dto/event.dto';
import { JobStatus } from './models/job-status.model';

@Injectable()
export class JobStatusService {
  constructor(
    @InjectRepository(JobStatus)
    private readonly jobStatusRepository: Repository<JobStatus>
  ) {}

  async create(jobId: string) {
    const status = new JobStatus();
    status.jobId = jobId;
    status.status = 'PENDING';

    return this.jobStatusRepository.save(status);
  }

  async findOne(jobId: string): Promise<JobStatus> {
    return this.jobStatusRepository.findOneBy({ jobId });
  }

  async save(jobStatus: JobStatus): Promise<JobStatus> {
    return this.jobStatusRepository.save(jobStatus);
  }

  static createFromEvent({
    eventId,
    eventType,
    eventTimestamp,
    error,
  }: EventDto) {
    const jobStatus = new JobStatus();
    Object.assign(jobStatus, {
      jobId: eventId,
      eventType,
      eventTimestamp,
      status: eventType === 'TODO_ERROR' ? 'FAILED' : 'COMPLETED',
      error,
    });

    return jobStatus;
  }
}
