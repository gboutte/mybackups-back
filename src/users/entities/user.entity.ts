import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public username: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public date_created: Date;
}
