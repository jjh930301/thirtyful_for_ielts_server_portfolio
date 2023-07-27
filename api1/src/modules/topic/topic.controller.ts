import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiRes } from 'src/models/api.response';
import { ConversationResponse } from '../user/response/conversations.response';
import { ConversationDto } from './dto/conversation.dto';
import { EvaluationDto } from './dto/evaluation.dto';
import { PromptDto } from './dto/prompt.dto';
import { SentenceResponse } from './response/sentence.response';
import { TopicService } from './topic.service';
import { ScoreEvaluationDto } from './dto/score_evaluation.dto';

@ApiTags('topic')
@ApiBearerAuth('user')
@Controller()
export class TopicController {
  constructor(private readonly topicSvc: TopicService) {}

  @Get()
  @ApiOperation({
    summary: '토픽 목록',
    description: ``,
  })
  public async getTopic(@Res() res) {
    try {
      const serviceData = await this.topicSvc.getTopic();
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }

  @Get(`list`)
  @ApiOperation({
    summary: '파트별 토픽 목록',
    description: `파트1, 2, 3별로 토픽과 서브 토픽들을 가져온다.`,
  })
  public async getTopicListsByPart(@Res() res) {
    try {
      const serviceData = await this.topicSvc.getTopicListsByPart();
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }

  @ApiOperation({
    summary: '첫 질문',
    description: ``,
  })
  @Post('question')
  @ApiResponse({
    type: SentenceResponse,
  })
  public async topicQuestion(@Res() res, @Body() body: PromptDto) {
    try {
      const serviceData = await this.topicSvc.topicQuestion(body.prompt);
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }

  @ApiOperation({
    summary: '대화',
    description: ``,
  })
  @ApiResponse({
    type: SentenceResponse,
  })
  @Post('conversation')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiConsumes('multipart/form-data')
  public async conversation(
    @Res() res,
    @Req() req,
    @Body() body: ConversationDto,
    @UploadedFile() audio: Express.Multer.File,
  ) {
    try {
      body.audio = audio;
      const serviceData = await this.topicSvc.conversation(req.user.id, body);
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }

  @Post('evaluation')
  @ApiOperation({
    summary: '평가하기',
    deprecated: true,
    description: ``,
  })
  @ApiResponse({
    type: ConversationResponse,
  })
  public async evaluation(@Res() res, @Req() req, @Body() body: EvaluationDto) {
    try {
      const serviceData = await this.topicSvc.evaluation(body, req.user.id);
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }

  @Post('evaluate')
  @ApiOperation({
    summary: '대화 평가하기',
    description: ``,
  })
  @ApiResponse({
    type: ConversationResponse,
  })
  public async evaluateForScore(
    @Res() res,
    @Req() req,
    @Body() body: ScoreEvaluationDto,
  ) {
    try {
      const serviceData = await this.topicSvc.evluateConversation(
        body,
        req.user.id,
      );
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }
}
