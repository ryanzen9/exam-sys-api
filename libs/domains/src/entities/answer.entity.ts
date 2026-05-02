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
import { Exam } from './exam.entity';
import { User } from './user.entity';

export type AnswerContent = {
  no: number;
  answer: string | string[];
};

export enum AnswerStatus {
  Draft = 'draft',
  Submitted = 'submitted',
  Graded = 'graded',
}

@Entity({
  name: 'T_Answer',
})
export class Answer {
  @PrimaryGeneratedColumn({
    name: 'Id',
    comment: '答卷ID',
  })
  @ApiProperty({ description: '答卷ID' })
  id: number;

  @Column({
    name: 'Score',
    comment: '分数',
  })
  @ApiProperty({ description: '分数' })
  score: number;

  @Column({
    type: 'json',
    name: 'Content',
    comment: '答题内容',
  })
  @ApiProperty({ description: '答题内容', type: [Object] })
  content: AnswerContent[];

  @Column({
    type: 'enum',
    enum: AnswerStatus,
    name: 'Status',
    comment: '答题状态',
    default: AnswerStatus.Draft,
  })
  @ApiProperty({ description: '答题状态' })
  status: AnswerStatus;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @ApiProperty({ description: '用户ID' })
  user: User;

  @ManyToOne(() => Exam, (exam) => exam.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @ApiProperty({ description: '考试ID' })
  exam: Exam;

  @CreateDateColumn({
    name: 'CreateAt',
    comment: '创建时间',
  })
  @ApiProperty({ description: '创建时间' })
  create_at: Date;

  @UpdateDateColumn({
    name: 'UpdateAt',
    comment: '更新时间',
  })
  @ApiProperty({ description: '更新时间' })
  update_at: Date;

  @Column({
    name: 'IsDeleted',
    default: false,
    comment: '是否删除',
  })
  @Exclude()
  @ApiHideProperty()
  is_deleted: boolean;

  constructor(partial: Partial<Answer>) {
    Object.assign(this, partial);
  }
}
