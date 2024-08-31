import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Public } from '../global/decorators/public.decorator';
import { BackupTypeLangType } from './backups-types/interfaces/backup-type-lang.type';
import types from './backups-types/types';
import { BackupsService } from './backups.service';
import { CreateBackupConfigDestinationDto } from './dto/create-backup-config-destination.dto';
import { CreateBackupConfigSourceDto } from './dto/create-backup-config-source.dto';
import { CreateBackupConfigDto } from './dto/create-backup-config.dto';
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
  @ApiBearerAuth()
  createConfig(@Body() createBackupConfigDto: CreateBackupConfigDto) {
    return this.backupsService.createConfig(createBackupConfigDto);
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
  update(
    @Param('id') id: string,
    @Body() updateBackupConfigDto: UpdateBackupConfigDto,
  ) {
    return this.backupsService.updateConfig(id, updateBackupConfigDto);
  }
  @Delete('config/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup config',
  })
  delete(@Param('id') id: string) {
    return this.backupsService.delete(id);
  }
  @Delete('config/source/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup source',
  })
  deleteSource(@Param('id') id: string) {
    return this.backupsService.deleteSource(id);
  }

  @Delete('config/destination/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The uuid of the backup destination',
  })
  deleteDestination(@Param('id') id: string) {
    return this.backupsService.deleteDestination(id);
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
}
