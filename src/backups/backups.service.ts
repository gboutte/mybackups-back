import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackupConfig } from './entities/backup-config.entity';
import { CreateBackupConfigDto } from './dto/create-backup-config.dto';
import { UpdateBackupConfigDto } from './dto/update-backup-config.dto';
import { LocalType } from './backups-types/types/implementations/local-type';
import { AbstractType } from './backups-types/abstract-type';
import { instanceOfBackupSource } from './backups-types/interfaces/backup-source.interface';
import { instanceOfBackupDestination } from './backups-types/interfaces/backup-destination.interface';
import { CreateBackupConfigSourceDto } from './dto/create-backup-config-source.dto';
import { CreateBackupConfigDestinationDto } from './dto/create-backup-config-destination.dto';
import { BackupSourceResultInterface } from './backups-types/interfaces/backup-source-result.interface';

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

  async runBackup(createBackupConfigDto: CreateBackupConfigDto) {
    if (this.validate(createBackupConfigDto)) {
      const sources = createBackupConfigDto.sources;
      const results: BackupSourceResultInterface[] = [];
      for (const source of sources) {
        results.push(await this.runBackupSource(source));
      }

      const destinations = createBackupConfigDto.destinations;
      for (const destination of destinations) {
        for (const result of results) {
          await this.runBackupDestination(destination, result);
        }
      }
    }
  }

  validate(
    createBackupConfigDto: CreateBackupConfigDto | UpdateBackupConfigDto,
  ) {
    const errors = [];

    // Verification of the sources
    const sources = createBackupConfigDto.sources;
    for (const source of sources) {
      errors.push(...this.validateSourceConfig(source));
    }

    // Verification of the destinations
    const destinations = createBackupConfigDto.destinations;
    for (const destination of destinations) {
      errors.push(...this.validateDestinationConfig(destination));
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return true;
  }

  validateSourceConfig(source: CreateBackupConfigSourceDto) {
    const errors = [];
    const backupType = this.getBackupType(source.type);
    if (instanceOfBackupSource(backupType)) {
      // Verifier que tous les parametres requis sont presents
      const sourceParameters = backupType.getSourceParameters();

      for (const parameter of sourceParameters) {
        if (parameter.required && !source.parameters[parameter.name]) {
          errors.push(
            `Parameter ${parameter.name} is required for source type ${source.type}`,
          );
        }
      }
      if (errors.length === 0) {
        backupType.setParameters(source.parameters);
        const validationResult = backupType.validateSourceParameters();
        if (validationResult !== true) {
          errors.push(...validationResult);
        }
      }
    }
    return errors;
  }

  validateDestinationConfig(destination: CreateBackupConfigDestinationDto) {
    const errors = [];
    const backupType = this.getBackupType(destination.type);
    if (instanceOfBackupDestination(backupType)) {
      // Verifier que tous les parametres requis sont presents
      const destinationParameters = backupType.getDestinationParameters();

      for (const parameter of destinationParameters) {
        if (parameter.required && !destination.parameters[parameter.name]) {
          errors.push(
            `Parameter ${parameter.name} is required for destination type ${destination.type}`,
          );
        }
      }
      if (errors.length === 0) {
        backupType.setParameters(destination.parameters);
        const validationResult = backupType.validateDestinationParameters();
        if (validationResult !== true) {
          errors.push(...validationResult);
        }
      }
    }
    return errors;
  }

  getBackupType(code: string): AbstractType {
    return new LocalType();
  }

  private runBackupSource(
    source: CreateBackupConfigSourceDto,
  ): Promise<BackupSourceResultInterface> {
    const backupType = this.getBackupType(source.type);
    if (instanceOfBackupSource(backupType)) {
      backupType.setParameters(source.parameters);
      return backupType.doSource();
    }
  }

  private runBackupDestination(
    destination: CreateBackupConfigDestinationDto,
    result: BackupSourceResultInterface,
  ) {
    const backupType = this.getBackupType(destination.type);
    if (instanceOfBackupDestination(backupType)) {
      backupType.setParameters(destination.parameters);
      return backupType.doDestination(result.temporaryFile);
    }
  }
}