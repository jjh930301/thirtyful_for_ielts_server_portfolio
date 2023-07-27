import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { PromptTypeEnum } from "src/enums/prompt.type";

export class CreatePromptDto {
  @ApiProperty({
    type : Number,
    default : 1,
    description : `
      아무거나 만들어서 쓰시면 됩니다.
    `
  })
  @IsNumber()
  @IsNotEmpty()
  type : number

  @ApiProperty({
    type : String,
    required : true
  })
  prompt : string;
}