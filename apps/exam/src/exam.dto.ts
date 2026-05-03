import { ExamStatus } from '@app/domains/entities/exam.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class QuestionDto {
  @ApiProperty({ description: '题号', example: 1 })
  @IsInt({ message: '题号必须是整数' })
  @Min(1, { message: '题号最小为 1' })
  no: number;

  @ApiProperty({
    description: '题目',
    example: '以下哪个是 TypeScript 的特点？',
  })
  @IsString({ message: '题目必须是字符串' })
  @IsNotEmpty({ message: '题目不能为空' })
  title: string;

  @ApiProperty({ description: '分数' })
  @IsNotEmpty({ message: '分数不能为空' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: '分数必须是数字，且最多两位小数' },
  )
  points: number;

  @ApiProperty({
    description: '题目类型',
    enum: ['single-choice', 'multiple-choice', 'true-false'],
    example: 'single-choice',
  })
  @IsString({ message: '题目类型必须是字符串' })
  @IsNotEmpty({ message: '题目类型不能为空' })
  type: 'single-choice' | 'multiple-choice' | 'true-false';

  @ApiProperty({
    description: '选项列表',
    example: ['A. 静态类型', 'B. 动态类型'],
  })
  @IsArray({ message: '选项列表必须是数组' })
  @IsString({ each: true, message: '每个选项必须是字符串' })
  options: string[];

  @ApiProperty({
    description: '答案',
    example: 'A',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  answer: string | string[];

  @ApiPropertyOptional({
    description: '题目描述/解析',
    example: 'TypeScript 是 JavaScript 的超集',
    required: false,
  })
  @IsString({ message: '题目描述必须是字符串' })
  @IsOptional()
  description?: string;
}

export class CreateExamDto {
  @ApiProperty({
    description: '考试名称',
    example: '2024 年期末考试',
    maxLength: 255,
  })
  @IsString({ message: '考试名称必须是字符串' })
  @IsNotEmpty({ message: '考试名称不能为空' })
  @MaxLength(255, { message: '考试名称最长 255 个字符' })
  name: string;

  @ApiProperty({
    description: '考试内容',
    type: [QuestionDto],
    example: [
      {
        no: 1,
        title: '以下哪个是 TypeScript 的特点？',
        type: 'single-choice',
        options: ['A. 静态类型', 'B. 动态类型'],
        answer: 'A',
        description: 'TypeScript 是 JavaScript 的超集',
      },
    ],
  })
  @IsArray({ message: '考试内容必须是数组' })
  @ValidateNested({ each: true, message: '考试内容格式不正确' })
  @Type(() => QuestionDto)
  content: QuestionDto[];

  @ApiPropertyOptional({
    description: '考试状态',
    enum: ExamStatus,
    example: ExamStatus.Unpublished,
    required: false,
  })
  @IsEnum(ExamStatus, { message: '考试状态必须是有效值' })
  @IsOptional()
  isPublish?: ExamStatus;
}

export class UpdateExamDto {
  @ApiPropertyOptional({
    description: '考试名称',
    example: '2024 年期末考试',
    maxLength: 255,
    required: false,
  })
  @IsString({ message: '考试名称必须是字符串' })
  @IsOptional()
  @MaxLength(255, { message: '考试名称最长 255 个字符' })
  name?: string;

  @ApiPropertyOptional({
    description: '考试内容',
    type: [QuestionDto],
    required: false,
  })
  @IsArray({ message: '考试内容必须是数组' })
  @ValidateNested({ each: true, message: '考试内容格式不正确' })
  @IsOptional()
  @Type(() => QuestionDto)
  content?: QuestionDto[];
}

export class ExamListQueryDto {
  @ApiPropertyOptional({ description: '页码', example: 1, default: 1 })
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小为 1' })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', example: 10, default: 10 })
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量最小为 1' })
  @Max(100, { message: '每页数量最大为 100' })
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;
}
