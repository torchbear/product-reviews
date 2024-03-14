import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';
import { ProductRating } from './product-rating.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToOne(() => ProductRating, (productRating) => productRating.product)
  rating: ProductRating;
}
