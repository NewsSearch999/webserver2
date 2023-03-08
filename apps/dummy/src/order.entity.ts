import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('orders')
export class Order {
  @Column()
  productId: number;

  @Column()
  userId: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column({default: '결제대기'})
  orderState: string;

  @Column({
    default:'결제대기',
  })
  deliveryState: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
