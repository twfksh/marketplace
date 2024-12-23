import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.carts)
    user: User;

    @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
    items: CartItem[];
}

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, cart => cart.items)
    cart: Cart;

    @ManyToOne(() => Product, product => product.id)
    product: Product;

    @Column('int')
    quantity: number;
}