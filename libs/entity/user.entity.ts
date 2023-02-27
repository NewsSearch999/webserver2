import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column('varchar', { length: 50 })
  email: string;

  @Column('varchar')
  password: string;
  //등급 bronze,silver,gold
  @Column({ default: 'bronze' }) //enum설정보류
  accountType: string;

  @Column({ default: false })
  deletedType: boolean;
}
