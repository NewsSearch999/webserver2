import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', name: 'productId' })
  productId: number;

  @ManyToOne(() => User, (user: User) => user.product, {
    eager: true,
    cascade: ['update'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'userId',
  })
  userId: Promise<User>;

  @Column('varchar', { length: 20 })
  productName: string;

  @Column('varchar')
  description: string;

  @Column('varchar', { length: 50 })
  image: string;

  @Column('smallint', {
    default: 0,
  })
  price: number;

  @Column('smallint', {
    default: 0,
  })
  stock: number;

  @Column({
    default: false,
  })
  isDeleted: boolean;

  @OneToMany(() => Order, (order) => order.product, { eager: false })
  order: Order[];
}
