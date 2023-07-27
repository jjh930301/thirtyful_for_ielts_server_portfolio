import { ApiProperty } from "@nestjs/swagger";

export class TestDto {
  @ApiProperty({
    type : 'string',
    format : 'binary',
    required : false,
    description : `
      최근 답변의 mp3 file
    `
  })
  audio : Express.Multer.File
}