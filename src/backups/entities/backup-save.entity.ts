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
  public id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public date_created: Date;

  @ManyToOne(() => BackupConfig, (config) => config.saves)
  public config: BackupConfig;

  @OneToMany(() => BackupSaveDestination, (destination) => destination.save, {
    cascade: true,
    eager: true,
  })
  public destinations: BackupSaveDestination[];

  @Column({ nullable: false })
  public filename: string;

  @Column({ nullable: false })
  public mimetype: string;
}
