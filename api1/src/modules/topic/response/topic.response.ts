import { ApiProperty } from "@nestjs/swagger";

class Topic {
  @ApiProperty({
    type : String,
    default :"Sports"
  })
  name: string;
  @ApiProperty({
    type : String,
    default :"low"
  })
  level: string;
}

export class TopicResponse {
  @ApiProperty({
    type : [Topic]
  })
  topics : [Topic]
}