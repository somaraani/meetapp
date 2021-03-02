import { Module } from '@nestjs/common';
import { NavigationService } from './navigation.service';

@Module({
  exports: [NavigationService],
  providers: [NavigationService]
})
export class NavigationModule {}
