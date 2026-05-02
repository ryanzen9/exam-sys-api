import { Auth, AuthGuard, Page, UserInfo } from '@app/common';
import { Answer } from '@app/domains/entities/answer.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AnswerListQueryDto,
  BeginAnswerDto,
  SubmitAnswerDto,
} from './answer.dto';
import { AnswerService } from './answer.service';

@ApiTags('答卷管理')
@Controller()
@SerializeOptions({
  strategy: 'exposeAll',
})
@Auth()
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post('answer')
  @ApiOperation({ summary: '开始答卷' })
  @ApiBody({ type: BeginAnswerDto, description: '开始答卷信息' })
  @ApiResponse({ status: 201, description: '开始答卷成功', type: Answer })
  async answerBegin(@UserInfo() user, @Body() beginAnswerDto: BeginAnswerDto) {
    const answer: Answer = await this.answerService.beginAnswer(
      user.id,
      beginAnswerDto,
    );

    return answer;
  }

  @Put('answer/:id')
  @ApiOperation({ summary: '提交答卷' })
  @ApiParam({ name: 'id', description: '答卷ID', type: Number })
  @ApiBody({ type: SubmitAnswerDto, description: '答卷内容' })
  @ApiResponse({ status: 200, description: '提交成功', type: Answer })
  async answerSubmit(
    @Param('id', ParseIntPipe) id: number,
    @Body() submitAnswerDto: SubmitAnswerDto,
  ) {
    const answer: Answer = await this.answerService.submitAnswer(
      id,
      submitAnswerDto,
    );

    return answer;
  }

  @Get('answer')
  @ApiOperation({ summary: '获取答卷列表' })
  @ApiResponse({
    status: 200,
    description: '答卷列表',
    type: Page<Answer>,
  })
  async getAnswerList(@UserInfo() user, @Query() query: AnswerListQueryDto) {
    const result = await this.answerService.getAnswerList(user.id, query);

    return result;
  }
}
