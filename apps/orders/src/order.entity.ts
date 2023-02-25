import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('orders')
export class Order {
  
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column()
  productId: string;

  @Column()
  productName: string;
  
  @Column()
  image: string;

  @Column()
  price: number;
}