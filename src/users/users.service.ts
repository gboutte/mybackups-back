import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  public findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  public findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id: id } });
  }

  public findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username: username } });
  }

  public async remove(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  public async create(registerUserDto: CreateUserDto): Promise<User> {
    const { password, ...data }: CreateUserDto = registerUserDto;

    const salt: string = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(password, salt);

    const user: User = this.usersRepository.create({ password: hash, ...data });
    return this.usersRepository.save(user);
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { password, ...data }: UpdateUserDto = updateUserDto;
    if (updateUserDto.password) {
      const salt: string = await bcrypt.genSalt();
      data['password'] = await bcrypt.hash(password, salt);
    }
    const user: User = await this.usersRepository.preload({
      id: id,
      ...data,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.usersRepository.save(user);
  }

  public getNumberOfUsers(): Promise<number> {
    return this.usersRepository.count();
  }
}
