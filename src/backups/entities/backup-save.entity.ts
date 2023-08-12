import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BackupConfig } from './backup-config.entity';
import { BackupSaveDestination } from './backup-save-destination.entity';

@Entity()
export class BackupSave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @ManyToOne(() => BackupConfig, (config) => config.saves)
  config: BackupConfig;

  @OneToMany(() => BackupSaveDestination, (destination) => destination.save, {
    cascade: true,
  })
  destinations: BackupSaveDestination[];
}
