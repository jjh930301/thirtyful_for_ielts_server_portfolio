import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ScoreEvaluationDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  conversation_id: string;
}
