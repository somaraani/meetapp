
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitationSchema } from './schemas/invitation.schema';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';


@Module({
  imports: [MongooseModule.forFeature([{name: 'invitation', schema: InvitationSchema}])],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService]
})
export class InvitationsModule {}
