import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.wishlist)
    user: User;

    @ManyToOne(() => Product, product => product.id)
    product: Product;
}