import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { accountType } from './enum/account.enum';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column('varchar', { length: 50 })
  email: string;

  @Column('varchar')
  password: string;

  @Column({
    type: 'enum',
    enum: accountType,
    default: accountType.bronze,
  })
  accountType: string;

  @Column({ default: false })
  deletedType: boolean;

  @OneToMany(() => Order, (order) => order.userId, { eager: false })
  order: Order[];

  @OneToMany(() => Product, (product) => product.userId, { eager: false })
  product: Product[];
}
