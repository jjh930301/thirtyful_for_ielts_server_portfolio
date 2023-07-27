import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
  @ApiProperty({
    type : Number
  })
  page : number;
  @ApiProperty({
    type : Number
  })
  count : number;
  @ApiProperty({
    type : Number,
    required : false,
    default : 0
  })
  mode : number;
}