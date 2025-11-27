import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BackupSave } from './backup-save.entity';

@Entity()
export class BackupSaveDestination {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public date_created: Date;

  @Column('simple-json')
  public parameters: Record<string, unknown>;

  @ManyToOne(() => BackupSave, (save) => save.destinations, {
    onDelete: 'CASCADE',
  })
  public save: BackupSave;

  @Column()
  public type: string;
}
