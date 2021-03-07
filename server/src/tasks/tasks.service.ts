import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TasksService {

    constructor(private schedulerRegistry: SchedulerRegistry) {}
    private readonly logger = new Logger(TasksService.name);

    addCronJob(name: string, time: Date, fun: () => void) {
        const job = new CronJob(time, fun);
        this.schedulerRegistry.addCronJob(name, job);
        job.start();

        this.logger.debug(`Created future task for ${name} to run at ${time.toISOString}`);
    }

    deleteCronJob(name: string) {
        this.schedulerRegistry.deleteCronJob(name);
        this.logger.debug(`Deleted future task for ${name}`);
    }
}
