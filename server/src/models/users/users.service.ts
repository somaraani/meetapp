
import { Injectable } from '@nestjs/common';
import { User } from '../../../../shared/types'

@Injectable()
export class UsersService {

    //mock users
    private readonly users: User[] = [
        {
            id: "1",
            email: "first@testing.com",
            publicData: {
                displayName: "a",
                displayPicture: "a",
            },
            privateData: {
                password: "testing1"
            }
        },
        {
            id: "2",
            email: "second@testing.com",
            publicData: {
                displayName: "a",
                displayPicture: "a",
            },
            privateData: {
                password: "testing2"
            }
        },
    ];

    async findOne(email: string): Promise<User | undefined> {
        //should get from databse 
        return this.users.find(user => user.email == email);
    }
}
