import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { deliveryState } from "../enum/delivery.enum";
import { orderState } from "../enum/order.enum";

@Entity('orders')
export class Order {
  
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column()
  productId: number;

  // @Column()
  // userId: number;

  @Column()
  quantity: number;

  @Column()
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