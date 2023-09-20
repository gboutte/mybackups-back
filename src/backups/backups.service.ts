import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackupConfig } from './entities/backup-config.entity';
import { CreateBackupConfigDto } from './dto/create-backup-config.dto';
import { UpdateBackupConfigDto } from './dto/update-backup-config.dto';

@Injectable()
export class BackupsService {
  constructor(
    @InjectRepository(BackupConfig)
    private backupConfigRepository: Repository<BackupConfig>,
  ) {}

  createConfig(createBackupConfigDto: CreateBackupConfigDto) {
    const backupConfig = this.backupConfigRepository.create(
      createBackupConfigDto,
    );
    return this.backupConfigRepository.save(backupConfig);
  }

  updateConfig(id: string, updateConfigDto: UpdateBackupConfigDto) {
    return this.backupConfigRepository.update(id, updateConfigDto);
  }

  findAllConfig(): Promise<BackupConfig[]> {
    return this.backupConfigRepository.find();
  }

  findOneConfig(id: string): Promise<BackupConfig> {
    return this.backupConfigRepository.findOne({ where: { id: id } });
  }

  async removeConfig(id: string): Promise<void> {
    await this.backupConfigRepository.delete(id);
  }
}
