import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ExamStatus {
  Published = 'published',
  Unpublished = 'unpublished',
}

export type ExamContent = Array<{
  no: number;
  title: string;
  type: 'single-choice' | 'multiple-choice' | 'true-false';
  options: string[];
  answer: string | string[];
  description?: string;
}>;

@Entity({
  name: 'T_Exam',
  comment: '考试表',
})
export class Exam {
  @PrimaryGeneratedColumn({
    name: 'Id',
    comment: '考试ID',
  })
  @ApiProperty({
    description: '考试ID',
    type: Number,
  })
  id: number;

  @Column({
    name: 'Name',
    type: 'varchar',
    length: 255,
    comment: '考试名称',
  })
  @ApiProperty({
    description: '考试名称',
    type: String,
  })
  name: string;

  @Column({
    name: 'IsPublish',
    type: 'enum',
    enum: ExamStatus,
    default: ExamStatus.Unpublished,
    comment: '考试状态',
  })
  @ApiProperty({
    description: '考试状态',
    enum: ExamStatus,
  })
  isPublish: ExamStatus;

  @Column({
    name: 'Content',
    type: 'json',
    comment: '考试内容',
  })
  @ApiProperty({
    description: '考试内容',
    type: Array<ExamContent>,
  })
  content: ExamContent;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    cascade: true,
  })
  @ApiProperty({
    description: '考试创建者',
    type: () => User,
  })
  creator: User;

  @CreateDateColumn({
    name: 'CreatedAt',
    comment: '创建时间',
  })
  @ApiProperty({
    description: '创建时间',
    type: Date,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'UpdatedAt',
    comment: '更新时间',
  })
  @ApiProperty({
    description: '更新时间',
    type: Date,
  })
  updatedAt: Date;

  @Column({
    name: 'IsDeleted',
    type: 'boolean',
    default: false,
    comment: '软删除标志',
  })
  @ApiHideProperty()
  @Exclude()
  is_deleted: boolean;
}
