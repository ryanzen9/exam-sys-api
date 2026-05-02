import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_TOKEN,
      },
    });
  }

  sendRegisterVerificationEmail(to: string, code: string) {
    const mailOptions: Mail.Options = {
      from: process.env.SMTP_USER,
      to,
      subject: '注册邮箱验证',
      text: `Your verification code is: ${code}`,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
