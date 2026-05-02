import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'testuser', description: '用户名' })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ example: 'password123', description: '密码' })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码最少 6 位' })
  password: string;
}

export class LoginResponse {
  @ApiProperty({ example: true, description: '操作是否成功' })
  success: boolean;

  @ApiProperty({
    example: '登录成功',
    description: '操作信息',
    required: false,
  })
  message?: string;
}

export class SendCodeDto {
  @ApiProperty({ example: 'testuser@example.com', description: '邮箱地址' })
  @IsString({ message: '邮箱必须是字符串' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'testuser', description: '用户名' })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ example: 'password123', description: '密码' })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码最少 6 位' })
  password: string;

  @ApiProperty({ example: 'testuser@example.com', description: '邮箱' })
  @IsString({ message: '邮箱必须是字符串' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({ example: 'ABC123', description: '验证码' })
  @IsString({ message: '验证码必须是字符串' })
  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;

  @ApiProperty({ example: 'Test User', description: '昵称', required: false })
  @IsString({ message: '昵称必须是字符串' })
  @IsOptional()
  nickName?: string;
}

export class PasswordUpdateDto {
  @ApiProperty({ example: 'oldpassword123', description: '旧密码' })
  @IsString({ message: '旧密码必须是字符串' })
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldPassword: string;

  @ApiProperty({ example: 'newpassword123', description: '新密码' })
  @IsString({ message: '新密码必须是字符串' })
  @IsNotEmpty({ message: '新密码不能为空' })
  @MinLength(6, { message: '新密码最少 6 位' })
  newPassword: string;
}
