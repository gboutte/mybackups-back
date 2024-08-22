import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { InstallController } from './install.controller';

@Module({
  imports: [UsersModule],
  controllers: [InstallController],
})
export class InstallModule {}
