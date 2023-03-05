import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @Column()
  productName: string;

  @Column({
    default:1
  })
  userId: number;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  price: number;

  @Column({
    default: 0
  })
  stock: number;

  @Column({
    default: false,
  })
  isDeleted: boolean;


}
