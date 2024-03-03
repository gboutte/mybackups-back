import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [StatusService],
  controllers: [StatusController],
  imports: [UsersModule],
})
export class StatusModule {}
