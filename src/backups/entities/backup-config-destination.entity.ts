import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BackupConfig } from './backup-config.entity';

@Entity()
export class BackupConfigDestination {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public date_created: Date;

  @Column()
  public type: string;

  @Column('simple-json')
  public parameters: Record<string, unknown>;

  @ManyToOne(() => BackupConfig, (config) => config.destinations, {
    onDelete: 'CASCADE',
  })
  public config: BackupConfig;
}
