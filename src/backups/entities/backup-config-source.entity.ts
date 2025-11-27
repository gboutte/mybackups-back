import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BackupConfig } from './backup-config.entity';

@Entity()
export class BackupConfigSource {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public date_created: Date;

  @Column()
  public type: string;

  @Column('simple-json')
  public parameters: Record<string, unknown>;

  @ManyToOne(() => BackupConfig, (config) => config.sources, {
    onDelete: 'CASCADE',
  })
  public config: BackupConfig;
}
