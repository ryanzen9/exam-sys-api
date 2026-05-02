import { Auth, AuthGuard } from '@app/common';
import { Exam } from '@app/domains/entities/exam.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateExamDto, ExamListQueryDto, UpdateExamDto } from './exam.dto';
import { ExamService } from './exam.service';

@ApiTags('考试管理')
@Controller()
@SerializeOptions({
  strategy: 'exposeAll',
})
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Auth()
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post('exam')
  @ApiOperation({ summary: '创建考试' })
  @ApiBody({ type: CreateExamDto, description: '考试创建信息' })
  @ApiResponse({ status: 201, description: '创建成功', type: Exam })
  async save(@Body() createExamDto: CreateExamDto) {
    return this.examService.save(createExamDto);
  }

  @Put('exam/:id')
  @ApiOperation({ summary: '更新考试' })
  @ApiParam({ name: 'id', description: '考试ID', type: Number })
  @ApiBody({ type: UpdateExamDto, description: '考试更新信息' })
  @ApiResponse({ status: 200, description: '更新成功', type: Exam })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExamDto: UpdateExamDto,
  ) {
    return this.examService.update(id, updateExamDto);
  }

  @Delete('exam/:id')
  @ApiOperation({ summary: '删除考试' })
  @ApiParam({ name: 'id', description: '考试ID', type: Number })
  @ApiResponse({ status: 200, description: '删除成功' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.examService.delete(id);
  }

  @Patch('exam/:id/publish')
  @ApiOperation({ summary: '发布考试' })
  @ApiParam({ name: 'id', description: '考试ID', type: Number })
  @ApiResponse({ status: 200, description: '发布成功', type: Exam })
  async publish(@Param('id', ParseIntPipe) id: number) {
    return this.examService.publish(id);
  }

  @Patch('exam/:id/unpublish')
  @ApiOperation({ summary: '取消发布考试' })
  @ApiParam({ name: 'id', description: '考试ID', type: Number })
  @ApiResponse({ status: 200, description: '取消发布成功', type: Exam })
  async unPublish(@Param('id', ParseIntPipe) id: number) {
    return this.examService.unpublish(id);
  }

  @Get('exam')
  @ApiOperation({ summary: '获取考试列表' })
  @ApiQuery({ type: ExamListQueryDto, description: '分页查询参数' })
  @ApiResponse({
    status: 200,
    description: '考试列表',
    type: () => ({
      data: [Exam],
      total: Number,
      page: Number,
      pageSize: Number,
    }),
  })
  async getExamList(@Query() query: ExamListQueryDto) {
    return this.examService.findAll(query);
  }
}
