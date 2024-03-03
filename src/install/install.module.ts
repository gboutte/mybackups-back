import { Module } from '@nestjs/common';
import { InstallController } from './install.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [InstallController],
})
export class InstallModule {}
