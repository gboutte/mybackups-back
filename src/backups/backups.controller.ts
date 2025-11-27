import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReadStream } from 'fs';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { Public } from '../global/decorators/public.decorator';
import {
  AbstractType,
  AbstractTypeSchema,
} from './backups-types/abstract-type';
import { BackupParameterErrorInterface } from './backups-types/interfaces/backup-parameter-error.interface';
import { BackupTypeI18nInterface } from './backups-types/interfaces/backup-type-i18n.interface';
import { BackupTypeLangType } from './backups-types/interfaces/backup-type-lang.type';
import types from './backups-types/types';
import { BackupsService } from './backups.service';
import { CreateBackupConfigDestinationDto } from './dto/create-backup-config-destination.dto';
import { CreateBackupConfigSourceDto } from './dto/create-backup-config-source.dto';
import { CreateBackupConfigDto } from './dto/create-backup-config.dto';
import { UpdateBackupConfigDestinationDto } from './dto/update-backup-config-destination.dto';
import { UpdateBackupConfigSourceDto } from './dto/update-backup-config-source.dto';
import { UpdateBackupConfigDto } from './dto/update-backup-config.dto';
import { BackupConfigDestination } from './entities/backup-config-destination.entity';
import { BackupConfigSource } from './entities/backup-config-source.entity';
import { BackupConfig } from './entities/backup-config.entity';
import { BackupSaveDestination } from './entities/backup-save-destination.entity';
import { BackupSave } from './entities/backup-save.entity';

@Controller('backups')
@ApiTags('backups')
export class BackupsController {
  constructor(private readonly backupsService: BackupsService) {}

  @Get('config')
  @ApiBearerAuth()
  public getAllConfig(): Promise<BackupConfig[]> {
    return this.backupsService.findAllConfig();
  }

  @Get('types')
  @ApiBearerAuth()
  public async getTypes(): Promise<AbstractTypeSchema[]> {
    const backupTypes: AbstractType[] = await types.getTypes();

    return backupTypes.map(
      (type: AbstractType): AbstractTypeSchema => type.getJsonSchema(),
    );
  }
  @Get('i18n/:lang')
  @Public()
  public async getI18n(
    @Param('lang') lang: BackupTypeLangType,
  ): Promise<Record<string, BackupTypeI18nInterface>> {
    return this.backupsService.getI18n(lang);
  }

  @Get('config/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup config',
  })
  public async getOneConfig(@Param('id') id: string): Promise<BackupConfig> {
    const backupConfig: BackupConfig | null =
      await this.backupsService.findOneConfig(id);
    if (backupConfig !== null) {
      return backupConfig;
    } else {
      throw new NotFoundException();
    }
  }

  @Post('config')
  @ApiBearerAuth()
  public async createConfig(
    @Body() createBackupConfigDto: CreateBackupConfigDto,
  ): Promise<BackupConfig> {
    const config: BackupConfig = await this.backupsService.createConfig(
      createBackupConfigDto,
    );
    await this.backupsService.refreshCron();
    return config;
  }

  @Post('config/:id/source')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup config',
  })
  public async createConfigSource(
    @Param('id') idBackupConfig: string,
    @Body() createBackupConfigSource: CreateBackupConfigSourceDto,
  ): Promise<BackupConfigSource> {
    const source: BackupConfigSource =
      await this.backupsService.createBackupSource(
        idBackupConfig,
        createBackupConfigSource,
      );
    await this.backupsService.refreshCron();
    return source;
  }
  @Patch('config/source/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup source',
  })
  public async updateConfigSource(
    @Param('id') idSource: string,
    @Body() createBackupConfigSource: UpdateBackupConfigSourceDto,
  ): Promise<BackupConfigSource> {
    const source: BackupConfigSource =
      await this.backupsService.updateBackupConfigSource(
        idSource,
        createBackupConfigSource,
      );
    await this.backupsService.refreshCron();
    return source;
  }

  @Post('config/:id/destination')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup config',
  })
  public async createConfigDestination(
    @Param('id') idBackupConfig: string,
    @Body() createBackupConfigDestination: CreateBackupConfigDestinationDto,
  ): Promise<BackupConfigDestination> {
    const destination: BackupConfigDestination =
      await this.backupsService.createBackupDestination(
        idBackupConfig,
        createBackupConfigDestination,
      );
    await this.backupsService.refreshCron();
    return destination;
  }
  @Patch('config/destination/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup destination',
  })
  public async updateConfigDestination(
    @Param('id') idDest: string,
    @Body() updateBackupConfigDestinationDto: UpdateBackupConfigDestinationDto,
  ): Promise<BackupConfigDestination> {
    const destination: BackupConfigDestination =
      await this.backupsService.updateBackupConfigDestination(
        idDest,
        updateBackupConfigDestinationDto,
      );
    await this.backupsService.refreshCron();
    return destination;
  }

  @Post('config/validate/source')
  @ApiBearerAuth()
  public async validateSource(
    @Body() createBackupConfigSource: CreateBackupConfigSourceDto,
  ): Promise<{ valid: boolean; errors: BackupParameterErrorInterface[] }> {
    const errors: BackupParameterErrorInterface[] =
      await this.backupsService.validateSourceConfig(createBackupConfigSource);
    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  @Post('config/validate/destination')
  @ApiBearerAuth()
  public async validateDestination(
    @Body() createBackupConfigDestination: CreateBackupConfigDestinationDto,
  ): Promise<{ valid: boolean; errors: BackupParameterErrorInterface[] }> {
    const errors: BackupParameterErrorInterface[] =
      await this.backupsService.validateDestinationConfig(
        createBackupConfigDestination,
      );
    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  @Patch('config/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup config',
  })
  public async update(
    @Param('id') id: string,
    @Body() updateBackupConfigDto: UpdateBackupConfigDto,
  ): Promise<BackupConfig> {
    const config: BackupConfig = await this.backupsService.updateConfig(
      id,
      updateBackupConfigDto,
    );
    await this.backupsService.refreshCron();
    return config;
  }
  @Delete('config/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup config',
  })
  public async delete(@Param('id') id: string): Promise<DeleteResult> {
    const result: DeleteResult = await this.backupsService.delete(id);
    await this.backupsService.refreshCron();
    return result;
  }
  @Delete('config/source/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup source',
  })
  public async deleteSource(@Param('id') id: string): Promise<DeleteResult> {
    const result: DeleteResult = await this.backupsService.deleteSource(id);
    await this.backupsService.refreshCron();
    return result;
  }

  @Delete('config/destination/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup destination',
  })
  public async deleteDestination(
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    const result: DeleteResult =
      await this.backupsService.deleteDestination(id);
    await this.backupsService.refreshCron();
    return result;
  }

  @Post('config/:id/run')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup config',
  })
  public async runBackup(@Param('id') id: string): Promise<void> {
    const backupConfig: BackupConfig | null =
      await this.backupsService.findOneConfig(id);
    if (backupConfig !== null) {
      return this.backupsService.runBackup(backupConfig);
    } else {
      throw new NotFoundException();
    }
  }

  @Get('config-save/download/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup config save destination',
  })
  public async download(@Param('id') id: string): Promise<StreamableFile> {
    const backupSave: BackupSave | null =
      await this.backupsService.findOneBackupSave(id);
    if (backupSave !== null) {
      let file: ReadStream | null = null;
      const destinations: BackupSaveDestination[] = backupSave.destinations;
      const index: number = 0;
      while (file === null && index < destinations.length) {
        try {
          file = await this.backupsService.getBackupFile(destinations[index]);
        } catch (e) {
          console.error(e);
          file = null;
        }
      }
      if (file !== null) {
        return new StreamableFile(file, {
          type: backupSave.mimetype,
          disposition: `attachment; filename="${backupSave.filename}"`,
        });
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  @Delete('config-save/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup config save destination',
  })
  public async deleteSave(@Param('id') id: string): Promise<void> {
    const backupSave: BackupSave | null =
      await this.backupsService.findOneBackupSave(id);
    if (backupSave !== null) {
      await this.backupsService.deleteBackupSave(backupSave);
    } else {
      throw new NotFoundException();
    }
  }
}
