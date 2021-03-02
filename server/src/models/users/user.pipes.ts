import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { User } from '@types';

@Injectable()
export class UpdateUserPipe implements PipeTransform {
  transform(value: User, metadata: ArgumentMetadata) {
    if (!value.email){
        throw new BadRequestException('email is required')
    }
    if (!value.publicData){
        throw new BadRequestException('public data is required');
    }
    return value;
  }
}