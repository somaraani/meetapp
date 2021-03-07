import { Body, Controller, Get,  Logger, Param, Put } from '@nestjs/common';
import { JourneySetting } from '@types';
import { Auth } from 'src/common/decorators/requests/auth.decorator';
import { JourneysService } from './journeys.service';

@Controller('journeys')
export class JourneysController {

    constructor(private journeysService: JourneysService) {}

    private readonly logger = new Logger(JourneysController.name);

    @Get(':id')
    find(@Param('id') journeyId: string) {
        this.logger.debug(`Requesting journey with id: ${journeyId}`);
        return this.journeysService.findById(journeyId);
    }

    @Put(':id/settings')
    update(@Param('id') journeyId: string, @Auth() auth, @Body() data: JourneySetting) {
        this.logger.debug(`user ${auth.userId} updating journey ${journeyId}`);
        return this.journeysService.update(journeyId, auth.userId, data);
    }
   
}