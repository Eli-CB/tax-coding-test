import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { ActivityType } from './dto/create-activity.dto';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  type: string;

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'text' })
  data: string;

  @ManyToOne(() => User, user => user.activities)
  user: User;
}