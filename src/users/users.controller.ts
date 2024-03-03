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
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the user',
  })
  async get(@Param('id') id: string): Promise<User> {
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
  async getMe(@Request() req): Promise<User> {
    const user = await this.usersService.findOne(req.user.userId);
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
  update(
    @Param('id')
    id: string,
    @Body()
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Post()
  @ApiBearerAuth()
  async create(
    @Body()
    createUserDto: CreateUserDto,
  ) {
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
