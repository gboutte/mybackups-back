import { PartialType } from '@nestjs/mapped-types';
import { CreateBackupConfigDestinationDto } from './create-backup-config-destination.dto';

export class UpdateBackupConfigDestinationDto extends PartialType(
  CreateBackupConfigDestinationDto,
) {}
