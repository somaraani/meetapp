
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
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel("user")
        private userModel: Model<UserDocument>
    ) { }

    async update(id: string, data: User) : Promise<User> {
        //error if someone else is already using email being changed
        const userWithEmail = await this.findByEmail(data.email);
        if(userWithEmail && userWithEmail.id != id) {
            throw new ConflictException("Another user is associated with that email.");
        }

        //should update in db
        const currUser = await this.userModel.findById(id);

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

        //error if someone else is using username
        const conflicts = await (await this.userModel.find({'publicData.username': { "$regex": data.details.username, "$options": "i" }})).length;
        if(conflicts) {
            throw new ConflictException("Another user is associated with that username.");
        }

        //this should push to a database
        //TODO look into UUID generation and where it should happen
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
        const user = new this.userModel(<User>{
            email: data.email,
            privateData: {
                password: hashedPassword
            },
            publicData: data.details
        });

        await user.save();
        user.privateData.password = '';
        return user;
    }

    async findAll(query?: string): Promise<PublicUserDto[]> {
        //should get from DB (and still use query if necessary)
        var users: UserDocument[];
        if (query) {
            users = await this.userModel.find(
                {$or: [{'publicData.displayName': { "$regex": query, "$options": "i"}},
                        {'publicData.username': { "$regex": query, "$options": "i" }}]}).limit(25);
        } else {
            users =  await this.userModel.find().limit(25);
        }

        //convert User to PublicUser
        return users.map(item => ({
            id: item.id,
            publicData: item.publicData
        })) as PublicUserDto[];
    }

    async findById(id: string): Promise<User | null> {
        //should get from databse
        return await this.userModel.findById(id);
    }

    async findByEmail(email: string): Promise<User | null> {
        //should get from databse 
        return await this.userModel.findOne({email: email});
    }

    async updateExpoPushToken(userId: string, token: string): Promise<void> {
        const user = await this.userModel.findById(userId);
        if (user === null){
            throw new NotFoundException("User not found");
        }
        user.expoPushToken = token || undefined;
        await user.save();
    }
}
