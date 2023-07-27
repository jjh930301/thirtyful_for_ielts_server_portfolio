import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TokenDto {
  @ApiProperty({
    type : String,
    required : true,
    description : `
      유저정보를 가져올 때는 access_token 사용
      토큰을 갱신할 때는 refresh_token 사용
    `
  })
  @IsNotEmpty()
  token : string;
}