import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAuthenticator } from 'src/middleware/admin.authenticator';
import { ApiRes } from 'src/models/api.response';
import { PromptService } from './prompt.service';
import { PromptResponse } from './response/prompt.response';

@ApiTags('prompt')
@ApiBasicAuth('user')
@Controller()
export class PromptController {
  constructor(
    private readonly promptSvc : PromptService
  ){}
  @ApiOperation({
    summary : 'all prompt'
  })
  @ApiResponse({
    type : PromptResponse
  })
  @Get()
  public async prompt(
    @Res() res,
  ) {
    try {
      const serviceData = await this.promptSvc.prompt();
      return serviceData.apiResponse(res).send();
    } catch(e) {
      return ApiRes._500(res , e.toString());
    }
  }
}
