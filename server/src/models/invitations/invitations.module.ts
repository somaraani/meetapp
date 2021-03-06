
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitationSchema } from './schemas/invitation.schema';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { UsersModule } from '../users/users.module';
import { MeetingsModule } from '../meetings/meetings.module';

@Module({
  imports: [MongooseModule.forFeature([{name: 'invitation', schema: InvitationSchema}]), UsersModule, MeetingsModule],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService]
})
export class InvitationsModule {}
