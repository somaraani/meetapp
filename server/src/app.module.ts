import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module';
import { JwtAuthGuard } from './authentication/jwt-auth.guard';
import { UsersModule } from './models/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './app.gateway';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, MongooseModule.forRoot(<string>process.env.DB_CONNECTION_URI)],
  controllers: [AppController],
  providers: [
    AppService,
    {
      //adds auth to all endpoints
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    AppGateway
  ],
})
export class AppModule { }
