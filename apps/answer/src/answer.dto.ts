import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export class AnswerContentDto {
  @ApiProperty({ description: '题号', example: 1 })
  @IsInt({ message: '题号必须是整数' })
  @Min(1, { message: '题号最小为 1' })
  no: number;

  @ApiProperty({
    description: '答案',
    example: 'A',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  answer: string | string[];
}

export class BeginAnswerDto {
  @ApiProperty({ description: '考试ID', example: 1 })
  @IsInt({ message: '考试ID必须是整数' })
  @Min(1, { message: '考试ID最小为 1' })
  @Type(() => Number)
  examId: number;
}

export class SubmitAnswerDto {
  @ApiProperty({
    description: '答题内容',
    type: [AnswerContentDto],
    example: [{ no: 1, answer: 'A' }],
  })
  @IsArray({ message: '答题内容必须是数组' })
  @ValidateNested({ each: true, message: '答题内容格式不正确' })
  @Type(() => AnswerContentDto)
  content: AnswerContentDto[];
}

export class AnswerListQueryDto {
  @ApiProperty({ description: '考试ID', example: 1, required: false })
  @IsInt({ message: '考试ID必须是整数' })
  @Min(1, { message: '考试ID最小为 1' })
  @Type(() => Number)
  @IsOptional()
  examId?: number;

  @ApiPropertyOptional({ description: '页码', example: 1, default: 1 })
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小为 1' })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', example: 10, default: 10 })
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量最小为 1' })
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;
}
