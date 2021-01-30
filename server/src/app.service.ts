import { Injectable } from '@nestjs/common';
import { User } from '@types';

@Injectable()
export class AppService {
  getHello(): User {
    return {
      email: 'name@email.com',
      name: 'hello there',
    };
  }
}
