
import { Injectable } from '@nestjs/common';
import { UsersService } from '../models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { jwt as jwtConstants } from './constants';
import { User } from '@types';
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

    verifyJwt(token: string) {
        try {
            const decoded = <any>jwt.verify(token, jwtConstants.secret);
            return {
                id: decoded.id,
                email: decoded.email,

            }
        }
        catch (e)
        {
            return null;
        }
    }
}
