import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BackupConfigDestination } from './backup-config-destination.entity';
import { BackupConfigSource } from './backup-config-source.entity';
import { BackupSave } from './backup-save.entity';

@Entity()
export class BackupConfig {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public to_keep: number;

  @Column()
  public frequency: string;

  @Column()
  public enabled: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public date_created: Date;

  @OneToMany(() => BackupSave, (save) => save.config, {
    cascade: true,
    eager: true,
  })
  public saves: BackupSave[];

  @OneToMany(() => BackupConfigSource, (save) => save.config, {
    cascade: true,
    eager: true,
  })
  public sources: BackupConfigSource[];

  @OneToMany(() => BackupConfigDestination, (save) => save.config, {
    cascade: true,
    eager: true,
  })
  public destinations: BackupConfigDestination[];
}
