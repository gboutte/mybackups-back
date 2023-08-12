import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BackupConfig } from './backup-config.entity';

@Entity()
export class BackupConfigSource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column()
  type: string;

  @Column('simple-json')
  data: any;

  @ManyToOne(() => BackupConfig, (config) => config.sources)
  config: BackupConfig;
}
