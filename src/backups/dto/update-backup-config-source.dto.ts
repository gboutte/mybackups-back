import { PartialType } from '@nestjs/mapped-types';
import { CreateBackupConfigSourceDto } from './create-backup-config-source.dto';

export class UpdateBackupConfigSourceDto extends PartialType(
  CreateBackupConfigSourceDto,
) {}
