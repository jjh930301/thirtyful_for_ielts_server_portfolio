import {
  Body,
  Controller,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiRes } from 'src/models/api.response';
import { AdminService } from './admin.service';
import { CreatePromptDto } from './dto/create.prompt.dto';
import { CreateTopicDto } from './dto/create.topic.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('admin')
@ApiBasicAuth('admin')
@Controller()
export class AdminController {
  constructor(private readonly adminSvc: AdminService) {}

  @ApiOperation({
    summary: 'prompt 생성 / 변경',
  })
  @Post('prompt')
  public async prompt(@Res() res, @Body() body: CreatePromptDto) {
    try {
      const serviceData = await this.adminSvc.prompt(body);
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }

  @ApiOperation({
    summary: '토픽 생성 / 변경',
  })
  @Post('topic')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  public async topic(
    @Res() res,
    @Query() query: CreateTopicDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      const serviceData = await this.adminSvc.insertTopics(query);
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }
}
