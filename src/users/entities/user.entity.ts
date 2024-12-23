import { Cart } from "src/cart/entities/cart.entity";
import { Notification } from "src/notifications/entities/notification.entity";
import { Order } from "src/orders/entities/order.entity";
import { Review } from "src/review/entities/review.entity";
import { Wishlist } from "src/wishlist/entities/wishlist.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ nullable: true })
    img: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: ['admin', 'customer'], default: 'customer' })
    role: 'admin' | 'customer';

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => Cart, (cart) => cart.user)
    carts: Cart[];

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @OneToMany(() => Wishlist, wishlist => wishlist.user)
    wishlist: Wishlist[];

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];
}
