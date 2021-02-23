import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module';
import { JwtAuthGuard } from './authentication/jwt-auth.guard';
import { UsersModule } from './models/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MeetingsModule } from './models/meetings/meetings.module';
import { InvitationsModule } from './models/invitations/invitations.module';

@Module({
  imports: [
            ConfigModule.forRoot(), 
            UsersModule,
            MeetingsModule, 
            InvitationsModule, 
            AuthModule, 
            MongooseModule.forRoot(<string>process.env.DB_CONNECTION_URI)
          ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      //adds auth to all endpoints
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule { }
