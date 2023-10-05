import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BackupSave } from './backup-save.entity';
import { BackupConfigSource } from './backup-config-source.entity';
import { BackupConfigDestination } from './backup-config-destination.entity';

@Entity()
export class BackupConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  to_keep: number;

  @Column()
  frequency: string;

  @Column()
  enabled: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @OneToMany(() => BackupSave, (save) => save.config, {
    cascade: true,
  })
  saves: BackupSave[];

  @OneToMany(() => BackupConfigSource, (save) => save.config, {
    cascade: true,
    eager: true,
  })
  sources: BackupConfigSource[];

  @OneToMany(() => BackupConfigDestination, (save) => save.config, {
    cascade: true,
    eager: true,
  })
  destinations: BackupConfigDestination[];
}
