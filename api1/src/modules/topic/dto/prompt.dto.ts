import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PromptDto {
  @ApiProperty({
    type : String,
    default : `You are an English speaking teacher.You are interviewing the user with the topic 'sports'`,
    required : true
  })
  @IsNotEmpty()
  prompt : string
}