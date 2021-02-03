
import { Injectable } from '@nestjs/common';
import { UsersService } from '../models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../shared/types'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validate(email, password): Promise<any> {
        const user = await this.usersService.findOne(email);

        //TODO these passwords need to be hased in the database

        if (user && user.privateData.password === password) {
            const { privateData, ...result } = user;
            return result;
        }

        return null;
    }

    async getJwt(user: User) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
