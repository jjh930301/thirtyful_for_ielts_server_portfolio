import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiRes } from 'src/models/api.response';
import { PaginationDto } from './dto/pagination.dto';
import {
  ConversationsResponse,
  ConversationResponse,
  ExamSummaryResponse,
} from './response/conversations.response';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth('user')
@Controller()
export class UserController {
  constructor(private readonly userSvc: UserService) {}

  @ApiOperation({
    summary: '대화 목록',
    description: ``,
  })
  @ApiResponse({
    type: ConversationsResponse,
  })
  @Get('conversations')
  public async conversations(
    @Res() res,
    @Req() req,
    @Query() query: PaginationDto,
  ) {
    try {
      const serviceData = await this.userSvc.conversations(req.user.id, query);
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }

  @ApiOperation({
    summary: '평가 가져오기',
  })
  @ApiResponse({
    type: ConversationResponse,
  })
  @Get('evaluation/:conversation_id')
  public async evaluation(
    @Res() res,
    @Param('conversation_id') conversationId: string,
  ) {
    try {
      const serviceData = await this.userSvc.evaluation(conversationId);
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }

  @ApiOperation({
    summary: '시험 요약 가져오기',
  })
  @ApiResponse({
    type: ExamSummaryResponse,
  })
  @Get('exam-summary')
  public async getAverageScores(@Res() res, @Req() req) {
    try {
      const serviceData = await this.userSvc.getExamSummary(req.user.id);
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }

  @ApiOperation({
    summary: '회원탈퇴',
    description: ``,
  })
  @Delete('')
  async withdrawn(@Res() res, @Req() req) {
    try {
      const serviceData = await this.userSvc.withdrawn(req.user.id);
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }
}
