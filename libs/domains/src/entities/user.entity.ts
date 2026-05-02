import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'T_User',
})
export class User {
  @PrimaryGeneratedColumn({
    name: 'Id',
  })
  @ApiProperty({ description: '用户ID' })
  id: number;

  @Column({
    unique: true,
    name: 'Username',
    nullable: false,
  })
  @ApiProperty({ description: '用户名' })
  username: string;

  @Column({
    name: 'NickName',
  })
  @ApiProperty({ description: '昵称' })
  nickName: string;

  @Column({
    name: 'Password',
  })
  @Exclude()
  @ApiHideProperty()
  password: string;

  @Column({
    name: 'Email',
    unique: true,
    nullable: false,
  })
  @ApiProperty({ description: '邮箱' })
  email: string;

  @CreateDateColumn({
    name: 'CreateAt',
  })
  @ApiProperty({ description: '创建时间' })
  create_at: Date;

  @UpdateDateColumn({
    name: 'UpdateAt',
  })
  @ApiProperty({ description: '更新时间' })
  update_at: Date;

  @Column({
    name: 'IsDeleted',
    default: false,
  })
  @Exclude()
  @ApiHideProperty()
  is_deleted: boolean;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
