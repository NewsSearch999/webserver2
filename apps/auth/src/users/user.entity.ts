import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column('varchar', { length: 50 })
  nickname: string;

  @Column('varchar', { length: 50 })
  password: string;

  @Column() //enum설정보류
  accountType: string;

  @Column()
  deletedType: boolean;
}
