import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('users')
@Unique(['email'])
export class User {

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    default: 'bronze'
  })
  accountType: string;

  @Column({ default: false })
  deletedType: boolean;
}
