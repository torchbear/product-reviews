import {
  Entity,
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductRating {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Product, (product) => product.rating, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;

  @Column('decimal', { precision: 3, scale: 2 })
  rating: number;
}
