import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { UserTypeEnum } from "src/enums/user.type";

export class RegistUserDto {
  @ApiProperty({
    type : String,
    required : false
  })
  email : string;

  @ApiProperty({
    type : String,
    required : false
  })
  display_name : string;

  @ApiProperty({
    type : String,
    required : false
  })
  profile_image_url : string;

  @ApiProperty({
    type : Number,
    required : true,
    default : 1,
    description : `
      1 : google,
      2 : apple
    `
  })
  @IsNumber()
  type : number;
}