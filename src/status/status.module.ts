import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';

@Module({
  providers: [StatusService],
  controllers: [StatusController],
  imports: [UsersModule],
})
export class StatusModule {}
