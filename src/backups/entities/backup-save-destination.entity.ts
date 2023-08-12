import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BackupSave } from './backup-save.entity';

@Entity()
export class BackupSaveDestination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column('simple-json')
  data: any;

  @ManyToOne(() => BackupSave, (save) => save.destinations)
  save: BackupSave;
}
