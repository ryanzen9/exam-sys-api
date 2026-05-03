import { Auth, AuthGuard } from '@app/common';
import {
  Controller,
  Get,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RankingQueryDto, RankingResponseDto } from './analyse.dto';
import { AnalyseService } from './analyse.service';

@ApiTags('统计分析')
@Controller()
@SerializeOptions({
  strategy: 'exposeAll',
})
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AnalyseController {
  constructor(private readonly analyseService: AnalyseService) {}

  @Auth()
  @Get('ranking')
  @ApiOperation({ summary: '获取排名' })
  @ApiResponse({
    status: 200,
    description: '排名列表',
    type: RankingResponseDto,
  })
  async ranking(@Query() query: RankingQueryDto): Promise<RankingResponseDto> {
    const { examId } = query;
    return this.analyseService.ranking(examId);
  }
}
