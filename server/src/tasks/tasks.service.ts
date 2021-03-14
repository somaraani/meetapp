import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';

@Injectable()
export class TasksService {

    constructor(private schedulerRegistry: SchedulerRegistry) {}
    private readonly logger = new Logger(TasksService.name);

    addCronJob(name: string, time: Date, fun: () => void) {
        this.logger.debug(`Creating future task for ${name} to run at ${time.toISOString()}`);

        if(this.hasCronJob(name)) {
            this.logger.log(`Job ${name} already exists, will update runtime instead to ${time.toISOString()}`)
            this.schedulerRegistry.deleteCronJob(name);
        }

        if(time.getTime() - new Date().getTime() <= 0) {
            this.logger.log(`Job date is set in past, will run now instead.`)
            fun();
            return;
        }

        const job = new CronJob(time, fun);
        this.schedulerRegistry.addCronJob(name, job);
        job.start();
    }

    deleteCronJob(name: string) {
        if(!this.hasCronJob(name)) {
            return;
        }

        this.schedulerRegistry.deleteCronJob(name);
        this.logger.debug(`Deleted future task for ${name}`);
    }

    hasCronJob(name: string) : boolean {
        return this.schedulerRegistry.doesExists("cron", name);
    }
}
