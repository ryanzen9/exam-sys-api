import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'testuser', description: '用户名' })
  username: string;
  @ApiProperty({ example: 'password123', description: '密码' })
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

export class RegisterDto {
  @ApiProperty({ example: 'testuser', description: '用户名' })
  username: string;
  @ApiProperty({ example: 'password123', description: '密码' })
  password: string;
  @ApiProperty({ example: 'testuser@example.com', description: '邮箱' })
  email: string;
  @ApiProperty({ example: 'ABC123', description: '验证码' })
  code: string;
  @ApiProperty({ example: 'Test User', description: '昵称', required: false })
  nickName?: string;
}

export class PasswordUpdateDto {
  @ApiProperty({ example: 'oldpassword123', description: '旧密码' })
  oldPassword: string;
  @ApiProperty({ example: 'newpassword123', description: '新密码' })
  newPassword: string;
}
