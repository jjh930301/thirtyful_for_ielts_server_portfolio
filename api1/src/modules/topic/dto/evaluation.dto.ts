import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EvaluationDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  conversation_id: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  prompt: string;
}
