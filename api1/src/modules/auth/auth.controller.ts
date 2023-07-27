import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegistUserDto } from './dto/regist.user.dto';
import { AuthService } from './auth.service';
import { ApiRes } from 'src/models/api.response';
import { UserResponse, RegistResponse } from './response/user.response';
import { TokenDto } from './dto/token.dto';
import { TokenResponse } from './response/token.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsUtil } from 'src/utils/aws';
import { ServiceData } from 'src/models/service.data';
import { TestDto } from './dto/test.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  aws: AwsUtil = new AwsUtil();

  constructor(private readonly authSvc: AuthService) {}

  @ApiOperation({
    summary: 'test',
    deprecated: true,
  })
  @Post('conversation')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiConsumes('multipart/form-data')
  async test(
    @Res() res,
    @Body() body: TestDto,
    @UploadedFile() audio: Express.Multer.File,
  ) {
    return ApiRes._500(res, 'deprecated');
    const audioUrl = await this.aws.uploadAudio('test', 'audio', audio);
    return ServiceData.ok('test', audioUrl, 2101).apiResponse(res).send();
  }

  @ApiOperation({
    summary: '회원가입',
    description: `
      2001 : 신규 유저
      2000 : 기존 유저
      4000 : 탈퇴한 유저
    `,
  })
  @ApiResponse({
    type: RegistResponse,
  })
  @Post()
  async regist(@Res() res, @Body() body: RegistUserDto) {
    try {
      const serviceData = await this.authSvc.regist(body);
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }

  @ApiOperation({
    summary: '유저 정보',
    description: ``,
  })
  @ApiResponse({
    type: UserResponse,
  })
  @Get('info')
  async user(@Res() res, @Query() query: TokenDto) {
    try {
      const serviceData = await this.authSvc.user(query.token);
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }

  @ApiOperation({
    summary: '토큰',
    description: `
      4000 : 탈퇴한 유저
    `,
  })
  @ApiResponse({
    type: TokenResponse,
  })
  @Get('token')
  async token(@Res() res, @Query() query: TokenDto) {
    try {
      const serviceData = await this.authSvc.token(query.token);
      return serviceData.apiResponse(res).send();
    } catch (e) {
      return ApiRes._500(res, e.toString());
    }
  }
}
