import { ApiProperty } from "@nestjs/swagger";

export class SentenceResponse {
  @ApiProperty({
    type : String,
  })
  conversation_id : string;
  
  @ApiProperty({
    type : String
  })
  sentence : string

  @ApiProperty({
    type : String
  })
  audio_url : string;
}