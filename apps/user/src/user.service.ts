import { User } from '@app/domains/entities/user.entity';
import { EmailService } from '@app/email';
import { NacosService } from '@app/nacos';
import { RedisService } from '@app/redis';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import cypto from 'crypto';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  @Inject()
  private readonly jwtService: JwtService;

  @Inject()
  private readonly emailService: EmailService;

  @Inject()
  private readonly redisService: RedisService;

  @Inject()
  private readonly nacosService: NacosService;

  async getUserInfo(userId: number) {
    const userRepo = this.entityManager.getRepository(User);
    return userRepo.findOne({ where: { id: userId } });
  }

  async login(loginDto: {
    username: string;
    password: string;
  }): Promise<{ success: boolean; message?: string; accessToken?: string }> {
    const { username, password } = loginDto;

    // 在这里你可以使用 this.entityManager 来查询数据库，验证用户的登录信息
    // 例如：
    const user = await this.entityManager.findOne(User, {
      where: { username },
    });

    if (!user) {
      return { success: false, message: '用户不存在' };
    }

    const hashPwd = cypto.createHash('sha256').update(password).digest('hex');
    if (user.password !== hashPwd) {
      return { success: false, message: '密码错误' };
    }

    const token = this.jwtService.sign({
      userId: String(user.id),
      username: user.username,
    });

    const message = await this.nacosService.getConfig(
      'LOGGING_SUCCESS_MESSAGE',
      'DEFAULT_GROUP',
    );
    return { success: true, accessToken: token, message };
  }

  async sendCode(email: string) {
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      await this.emailService.sendRegisterVerificationEmail(email, code);

      await this.redisService.set(`register_code:${email}`, code, 300); // 验证码有效期5分钟

      return { success: true, message: '验证码发送成功' };
    } catch (err) {
      console.error('发送验证码失败:', err);
      return { success: false, message: '验证码发送失败' };
    }
  }

  async register(registerDto: {
    username: string;
    password: string;
    email: string;
    code: string;
    nickName?: string;
  }): Promise<{ success: boolean; message?: string }> {
    const exitsUser = await this.entityManager.findOne(User, {
      where: { username: registerDto.username },
    });

    if (exitsUser) {
      return { success: false, message: '用户名已存在' };
    }

    // 验证邮箱
    const cache = await this.redisService.get(
      `register_code:${registerDto.email}`,
    );

    if (!cache || registerDto.code.toUpperCase() !== cache.toUpperCase()) {
      return { success: false, message: '验证码错误或已过期' };
    }

    const hashPwd = cypto
      .createHash('sha256')
      .update(registerDto.password)
      .digest('hex');
    const user = this.entityManager.create(User, {
      username: registerDto.username,
      password: hashPwd,
      nickName: registerDto.nickName,
      email: registerDto.email,
    });
    await this.entityManager.save(user);

    return { success: true };
  }

  async passwordChange(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const userRepo = this.entityManager.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return { success: false, message: '用户不存在' };
    }

    const hashOldPwd = cypto
      .createHash('sha256')
      .update(oldPassword)
      .digest('hex');
    if (user.password !== hashOldPwd) {
      return { success: false, message: '旧密码错误' };
    }

    const hashNewPwd = cypto
      .createHash('sha256')
      .update(newPassword)
      .digest('hex');
    user.password = hashNewPwd;
    await userRepo.save(user);

    return { success: true, message: '密码修改成功' };
  }
}
