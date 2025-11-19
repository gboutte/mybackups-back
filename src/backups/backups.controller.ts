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
import { Public } from '../global/decorators/public.decorator';
import { BackupTypeLangType } from './backups-types/interfaces/backup-type-lang.type';
import types from './backups-types/types';
import { BackupsService } from './backups.service';
import { CreateBackupConfigDestinationDto } from './dto/create-backup-config-destination.dto';
import { CreateBackupConfigSourceDto } from './dto/create-backup-config-source.dto';
import { CreateBackupConfigDto } from './dto/create-backup-config.dto';
import { UpdateBackupConfigDestinationDto } from './dto/update-backup-config-destination.dto';
import { UpdateBackupConfigSourceDto } from './dto/update-backup-config-source.dto';
import { UpdateBackupConfigDto } from './dto/update-backup-config.dto';
import { BackupConfig } from './entities/backup-config.entity';

@Controller('backups')
@ApiTags('backups')
export class BackupsController {
  constructor(private readonly backupsService: BackupsService) {}

  @Get('config')
  @ApiBearerAuth()
  getAllConfig() {
    return this.backupsService.findAllConfig();
  }

  @Get('types')
  @ApiBearerAuth()
  async getTypes() {
    const backupTypes = await types.getTypes();

    return backupTypes.map((type) => type.getJsonSchema());
  }
  @Get('i18n/:lang')
  @Public()
  async getI18n(@Param('lang') lang: BackupTypeLangType) {
    return this.backupsService.getI18n(lang);
  }

  @Get('config/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup config',
  })
  async getOneConfig(@Param('id') id: string): Promise<BackupConfig> {
    const backupConfig = await this.backupsService.findOneConfig(id);
    if (backupConfig !== null) {
      return backupConfig;
    } else {
      throw new NotFoundException();
    }
  }

  @Post('config')
  @ApiBearerAuth() async createConfig(@Body() createBackupConfigDto: CreateBackupConfigDto) {
    const config = await this.backupsService.createConfig(createBackupConfigDto);
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
  async createConfigSource(
    @Param('id') idBackupConfig: string,
    @Body() createBackupConfigSource: CreateBackupConfigSourceDto,
  ) {
    const source = await this.backupsService.createBackupSource(
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
  async updateConfigSource(
    @Param('id') idSource: string,
    @Body() createBackupConfigSource: UpdateBackupConfigSourceDto,
  ) {
    const source = await this.backupsService.updateBackupConfigSource(
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
  async createConfigDestination(
    @Param('id') idBackupConfig: string,
    @Body() createBackupConfigDestination: CreateBackupConfigDestinationDto,
  ) {
    const destination = await this.backupsService.createBackupDestination(
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
  async updateConfigDestination(
    @Param('id') idDest: string,
    @Body() updateBackupConfigDestinationDto: UpdateBackupConfigDestinationDto,
  ) {
    const destination = await this.backupsService.updateBackupConfigDestination(
      idDest,
      updateBackupConfigDestinationDto,
    );
    await this.backupsService.refreshCron();
    return destination;
  }

  @Post('config/validate/source')
  @ApiBearerAuth()
  validateSource(
    @Body() createBackupConfigSource: CreateBackupConfigSourceDto,
  ) {
    const errors = this.backupsService.validateSourceConfig(
      createBackupConfigSource,
    );
    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  @Post('config/validate/destination')
  @ApiBearerAuth()
  validateDestination(
    @Body() createBackupConfigDestination: CreateBackupConfigDestinationDto,
  ) {
    const errors = this.backupsService.validateDestinationConfig(
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
  async update(
    @Param('id') id: string,
    @Body() updateBackupConfigDto: UpdateBackupConfigDto,
  ) {
    const config = await this.backupsService.updateConfig(id, updateBackupConfigDto);
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
  async delete(@Param('id') id: string) {
    const result = await this.backupsService.delete(id);
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
  async deleteSource(@Param('id') id: string) {
    const result = await this.backupsService.deleteSource(id);
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
  async deleteDestination(@Param('id') id: string) {
    const result = await this.backupsService.deleteDestination(id);
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
  async runBackup(@Param('id') id: string) {
    const backupConfig = await this.backupsService.findOneConfig(id);
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
  async download(@Param('id') id: string): Promise<StreamableFile> {
    const backupSave = await this.backupsService.findOneBackupSave(id);
    if (backupSave !== null) {
      let file = null;
      const destinations = backupSave.destinations;
      const index = 0;
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
  async deleteSave(@Param('id') id: string) {
    const backupSave = await this.backupsService.findOneBackupSave(id);
    if (backupSave !== null) {
      await this.backupsService.deleteBackupSave(backupSave);
    } else {
      throw new NotFoundException();
    }
  }
}
