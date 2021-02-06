
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@types'
import { randomBytes } from 'crypto';
import { CreateUserDto } from './dto/CreateUserDto';
import { v4 as uuidv4 } from 'uuid';
import { PublicUserDto } from './dto/PublicUserDto';

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

    async update(id: string, data: User) : Promise<User | undefined> {
        //error if someone else is already using email being changed
        const userWithEmail = await this.findByEmail(data.email);
        if(userWithEmail?.id != id) {
            throw new ConflictException("Another user is associated with that email.");
        }

        //should update in db
        const currUser: User | undefined = await this.findById(id);

        if (currUser) {
            //ensure user does not change their id
            data.id = id;
            Object.assign(currUser, data);

            return currUser;
        } else {
            throw new NotFoundException("A user with that id was not found.");
        }
    }

    async create(data: CreateUserDto) : Promise<User | undefined> {
        //error if someone else is already using email being changed
        const userWithEmail = await this.findByEmail(data.email);
        if(userWithEmail) {
            throw new ConflictException("Another user is associated with that email.");
        }

        //this should push to a database
        //TODO look into UUID generation and where it should happen

        const user = {
            id: uuidv4(),
            email: data.email,
            privateData: {
                password: data.password
            },
            publicData: data.details
        };

        this.users.push(user);
        return user;
    }

    async findAll(query?: string): Promise<PublicUserDto[]> {
        //should get from DB (and still use query if necessary)
        var users: User[];
        if (query) {
            users = this.users.filter(user => user.publicData.displayName.indexOf(query) != -1);
        } else {
            users = this.users;
        }

        //convert User to PublicUser
        return users.map(item => ({
            id: item.id,
            publicData: item.publicData
        })) as PublicUserDto[];
    }

    async findById(id: string): Promise<User | undefined> {
        //should get from databse 
        return this.users.find(user => user.id == id);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        //should get from databse 
        return this.users.find(user => user.email == email);
    }
}
