import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest } from '../common/types/fastify-request.types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  public getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the user',
  })
  public async get(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (user !== null) {
      return user;
    } else {
      throw new NotFoundException(); // You can get information only on registered user
    }
  }

  @Get('me')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor) // Intercept response (User) to remove password field
  public async getMe(@Request() req: AuthenticatedRequest): Promise<User> {
    const user: User | null = await this.usersService.findOne(req.user.userId);
    if (user !== null) {
      return user;
    } else {
      throw new NotFoundException(); // You can get information only on registered user
    }
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the user',
  })
  public update(
    @Param('id')
    id: string,
    @Body()
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Post()
  @ApiBearerAuth()
  public async create(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<User> {
    //Check if the user exists

    const user = await this.usersService.findOneByUsername(
      createUserDto.username,
    );
    console.log(user);
    if (user) {
      throw new HttpException('USERNAME_ALREADY_EXISTS', HttpStatus.CONFLICT);
    }
    return this.usersService.create(createUserDto);
  }
}
