import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { deliveryState } from "../enum/delivery.enum";
import { orderState } from "../enum/order.enum";
import { Product } from "./product.entity";

@Entity('orders')
export class Order {
  
  @PrimaryGeneratedColumn({ type: 'int', name: 'orderId'})
  orderId: number;

  @ManyToOne( () => Product, (product : Product) => product.order, {
    eager: true,
    cascade: ['update'],
    onDelete: 'CASCADE'
  })
  @JoinColumn({
    name: 'productId',
    referencedColumnName: 'productId'
  })
  product: Promise<Product>;

  // @Column()
  // userId: number;

  @Column('smallint', {name: 'quantity'})
  quantity: number;

  @Column('smallint', {name: 'price'})
  price: number;

  @Column({
    type: "enum",
    enum: orderState,
    default: orderState.결제대기,
})
  orderState: orderState;

  @Column({
    type: "enum",
    enum: deliveryState,
    default: deliveryState.결제대기,
})
  deliveryState: deliveryState;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}