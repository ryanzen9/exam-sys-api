import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class RankingQueryDto {
  @ApiPropertyOptional({ description: '考试ID', example: 1 })
  @IsInt({ message: '考试ID必须是整数' })
  @Min(1, { message: '考试ID最小为 1' })
  @IsOptional()
  @Type(() => Number)
  examId?: number;
}

export class RankingItemDto {
  @ApiProperty({ description: '排名', example: 1 })
  rank: number;

  @ApiProperty({ description: '用户ID', example: 1 })
  userId: number;

  @ApiProperty({ description: '用户名', example: 'testuser' })
  username: string;

  @ApiProperty({ description: '昵称', example: 'Test User' })
  nickName: string;

  @ApiProperty({ description: '分数', example: 95 })
  score: number;

  @ApiProperty({
    description: '考试名称',
    example: '2024 年期末考试',
    required: false,
  })
  examName?: string;
}

export class RankingResponseDto {
  @ApiProperty({
    description: '排名列表',
    type: [RankingItemDto],
  })
  data: RankingItemDto[];

  @ApiProperty({ description: '总数', example: 100 })
  total: number;
}
