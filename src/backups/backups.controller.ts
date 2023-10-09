import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { BackupsService } from './backups.service';
import { BackupConfig } from './entities/backup-config.entity';
import { CreateBackupConfigDto } from './dto/create-backup-config.dto';
import { UpdateBackupConfigDto } from './dto/update-backup-config.dto';
import types from './backups-types/types';

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

  @Post('config/validate')
  @ApiBearerAuth()
  validate(@Body() createBackupConfigDto: CreateBackupConfigDto) {
    // if (validation === true) {
    //   this.backupsService.runBackup(createBackupConfigDto);
    // }

    return this.backupsService.validate(createBackupConfigDto);
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
}
