import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

const mail_addr = process.env.NM_EMAIL;
const passwd = process.env.NM_PASSWD;

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private usersService: UsersService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: mail_addr,
        pass: passwd,
      },
    });
  }

  async sendOrderConfirmation(email: string, orderId: number) {
    const mailOptions = {
      from: mail_addr,
      to: email,
      subject: 'Order Confirmation',
      text: `Your order with ID ${orderId} has been confirmed.`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendShippingUpdate(email: string, orderId: number, status: string) {
    const mailOptions = {
      from: mail_addr,
      to: email,
      subject: 'Shipping Update',
      text: `Your order with ID ${orderId} is now ${status}.`,
    };

    await this.transporter.sendMail(mailOptions);
  }


  async createInAppNotification(userId: number, message: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = this.notificationsRepository.create({ user, message });
    return this.notificationsRepository.save(notification);
  }

  async getNotifications(userId: number): Promise<Notification[]> {


    return this.notificationsRepository.find({ where: { user: { id: userId } } });
  }

  async markAsRead(notificationId: number) {
    const notification = await this.notificationsRepository.findOne({ where: { id: notificationId } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.read = true;
    return this.notificationsRepository.save(notification);
  }
}