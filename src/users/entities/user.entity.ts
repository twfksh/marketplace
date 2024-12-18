import { Order } from "src/orders/entities/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: ['admin', 'customer'], default: 'customer' })
    role: 'admin' | 'customer';

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
