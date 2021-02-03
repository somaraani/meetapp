import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { Public } from 'src/common/decorators/metadata/public';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('authenticate')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post()
    async auth(@Request() req) {
        return this.authService.getJwt(req.user);
    }

}