
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@types'
import { randomBytes } from 'crypto';
import { CreateUserDto } from './dto/CreateUserDto';
import { v4 as uuidv4 } from 'uuid';
import { PublicUserDto } from './dto/PublicUserDto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { exception } from 'console';
import { transformAuthInfo } from 'passport';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel("user")
        private userModel: Model<UserDocument>
    ) { }
    //mock users
    private readonly users: User[] = [
        {
            _id: "1",
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
            _id: "2",
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

    async update(id: string, data: User) : Promise<User> {
        //error if someone else is already using email being changed
        const userWithEmail = await this.findByEmail(data.email);
        if(userWithEmail && userWithEmail?._id != id) {
            throw new ConflictException("Another user is associated with that email.");
        }

        //should update in db
        const currUser: UserDocument | null = await this.findById(id);

        if (currUser) {
            //ensure user does not change their id
            //currUser.privateData = data.privateData;
            currUser.publicData = data.publicData;
            currUser.email = data.email;
            currUser.save();

            return currUser;
        } else {
            throw new NotFoundException("A user with that id was not found.");
        }
    }

    async create(data: CreateUserDto) : Promise<User> {
        //error if someone else is already using email being changed
        const userWithEmail = await this.findByEmail(data.email);
        if(userWithEmail) {
            throw new ConflictException("Another user is associated with that email.");
        }

        //this should push to a database
        //TODO look into UUID generation and where it should happen

        const user = new this.userModel(<User>{
            email: data.email,
            privateData: {
                //password: data.password
                password: 'password'
            },
            publicData: data.details
        });

        user.save();
        return user;
    }

    async findAll(query?: string): Promise<PublicUserDto[]> {
        //should get from DB (and still use query if necessary)
        var users: UserDocument[];
        if (query) {
            users = await this.userModel.find({'publicData.displayName': { "$regex": query, "$options": "i" }});
        } else {
            users =  await this.userModel.find();
        }

        //convert User to PublicUser
        return users.map(item => ({
            id: item.id,
            publicData: item.publicData
        })) as PublicUserDto[];
    }

    async findById(id: string): Promise<UserDocument | null> {
        //should get from databse
        return await this.userModel.findById(id);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        //should get from databse 
        return await this.userModel.findOne({email: email});
    }
}
