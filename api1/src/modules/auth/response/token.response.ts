import { ApiProperty } from "@nestjs/swagger";

export class TokenResponse {
  @ApiProperty({
    type : String
  })
  access_token : string;

  @ApiProperty({
    type : String
  })
  refresh_token : string;
}