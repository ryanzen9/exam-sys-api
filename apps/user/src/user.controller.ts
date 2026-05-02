import { Auth, UserInfo } from '@app/common';
import { User } from '@app/domains/entities/user.entity';
import { Body, Controller, Get, Post, SerializeOptions } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  LoginDto,
  LoginResponse,
  PasswordUpdateDto,
  RegisterDto,
} from './user.dto';
import { UserService } from './user.service';

@Controller()
@SerializeOptions({
  strategy: 'exposeAll',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({ status: 200, description: '用户信息', type: User })
  getUserInfo(@UserInfo() user: any) {
    return this.userService.getUserInfo(user.id as number);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 201, description: '登录成功', type: LoginResponse })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.userService.login(loginDto);
  }

  @Post('send-code')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string' } },
      description: '邮箱地址',
    },
  })
  @ApiOperation({ summary: '发送验证码' })
  @ApiResponse({ status: 200, description: '验证码发送成功' })
  sendCode(@Body() emailDto: { email: string }) {
    return this.userService.sendCode(emailDto.email);
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 201, description: '注册成功', type: LoginResponse })
  async register(
    @Body()
    registerDto: RegisterDto,
  ): Promise<LoginResponse> {
    return this.userService.register(registerDto);
  }

  @Auth()
  @ApiBearerAuth()
  @Post('update-password')
  @ApiOperation({ summary: '更新密码' })
  @ApiResponse({
    status: 200,
    description: '密码更新成功',
    type: LoginResponse,
  })
  async updatePassword(
    @UserInfo() user: any,
    @Body() passwordUpdateDto: PasswordUpdateDto,
  ) {
    return this.userService.passwordChange(
      user.id,
      passwordUpdateDto.oldPassword,
      passwordUpdateDto.newPassword,
    );
  }
}
