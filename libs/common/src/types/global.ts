import { ApiProperty } from '@nestjs/swagger';

export class Page<T> {
  @ApiProperty({
    description: '数据列表',
    type: 'array',
    items: { type: 'object' },
  })
  data: T[];
  @ApiProperty({
    description: '总数',
    type: 'number',
  })
  total: number;
  @ApiProperty({
    description: '当前页码',
    type: 'number',
  })
  page: number;
  @ApiProperty({
    description: '每页数量',
    type: 'number',
  })
  pageSize: number;

  constructor(data: T[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
  }
}
