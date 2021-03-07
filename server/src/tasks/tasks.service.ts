import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';

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

    updateCronTime(name: string, date: Date) {
        if(!this.hasCronJob(name)) {
            this.logger.error(`Trying to update task ${name} that does not exist.`);
            return;
        }

        const job = this.schedulerRegistry.getCronJob(name);
        job.setTime(new CronTime(date));
    }

    hasCronJob(name: string) : boolean {
        return this.schedulerRegistry.doesExists("cron", name);
    }
}
