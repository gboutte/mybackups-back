import {Module, OnModuleInit} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { BackupsModule } from './backups/backups.module';
import { InstalledJwtGuard } from './global/guards/installed-jwt.guard';
import { InstallModule } from './install/install.module';
import { StatusModule } from './status/status.module';
import { UsersModule } from './users/users.module';
import {ScheduleModule} from "@nestjs/schedule";
import {BackupsService} from "./backups/backups.service";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client/dist/client'),
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_USER: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_NAME: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        APP_SECRET: Joi.required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    InstallModule,
    AuthModule,
    BackupsModule,
    StatusModule,
    ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: InstalledJwtGuard,
    },
  ],
})
export class AppModule implements OnModuleInit{
  constructor(private backupService:BackupsService) {

  }
  onModuleInit() {
    this.backupService.refreshCron();
  }
}
