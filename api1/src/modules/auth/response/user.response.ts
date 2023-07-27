import { ApiProperty } from "@nestjs/swagger";

class User {
  @ApiProperty({
    type : String
  })
  email : string;

  @ApiProperty({
    type : String
  })
  display_name : string;

  @ApiProperty({
    type : String
  })
  profile_image_url : string;

  @ApiProperty({
    type : Number
  })
  type : number;
}

export class UserResponse {
  @ApiProperty({
    type : User
  })
  user : User;
}

export class RegistResponse {
  @ApiProperty({
    type : UserResponse
  })
  user : UserResponse

  @ApiProperty({
    type : String
  })
  access_token : string;

  @ApiProperty({
    type : String
  })
  refresh_token : string;
}