import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { PromptTypeEnum } from 'src/enums/prompt.type';

export class CreateTopicDto {
  @ApiProperty({
    type: Number,
    default: 1,
    description: `
      스피킹 파트 1, 2, 3 중 .
    `,
  })
  @IsNumber()
  @IsNotEmpty()
  part: number;

  @ApiProperty({
    type: String,
    required: true,
  })
  topic: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: `
      토픽 아이콘 이미지
    `,
  })
  audio: Express.Multer.File;
}
