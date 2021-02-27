
import { Injectable } from '@nestjs/common';
import { UsersService } from '../models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../shared/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validate(email, password): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (user && await bcrypt.compare(password, user.privateData.password)) {
            const result = {id: user.id, email: user.email};
            return result;
        }

        return null;
    }

    async getJwt(user: User) {
        const payload = { email: user.email, id: user.id };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
