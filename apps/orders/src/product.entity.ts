import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product {
  
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  productName: string;
  
  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  price: number;
}