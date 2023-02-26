import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', name: 'productId' })
  productId: number;

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
