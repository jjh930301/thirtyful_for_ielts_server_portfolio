import { ApiProperty } from '@nestjs/swagger';

class QuestionModel {
  @ApiProperty({
    example: '645c96eb7dcd5ffa4b73fefd',
    type: String,
    description: ``,
  })
  _id: string;

  @ApiProperty({
    example:
      "Hello! Let's talk about globalisation. Do you think that globalisation has led to a loss of cultural identity in some countries? Can you explain why or provide an example?",
    type: String,
    description: ``,
  })
  question: string;

  @ApiProperty({
    example: 'i dont know',
    type: String,
    description: ``,
  })
  original_answer: string;

  @ApiProperty({
    example:
      'https://audio.file.url.com/645c956b7dcd5ffa4b73fef8/audio/1683789547275.mp3',
    type: String,
    description: ``,
  })
  answer_audio_file_url: string;

  @ApiProperty({
    example: '2023-05-11T06:56:15.411Z',
    type: String,
    description: ``,
  })
  question_prompt_at: string;

  @ApiProperty({
    example: '2023-05-11T06:59:15.411Z',
    type: String,
    description: ``,
  })
  answer_submitted_at: string;
}
class ConversationModel {
  @ApiProperty({
    example: '645c96eb7dcd5ffa4b73fefb',
    type: String,
    description: ``,
  })
  _id: string;

  @ApiProperty({
    example: '645c956b7dcd5ffa4b73fef8',
    type: String,
    description: ``,
  })
  user: string;

  @ApiProperty({
    type: [QuestionModel],
  })
  questions: [QuestionModel];

  @ApiProperty({
    example: 1,
    type: Number,
    description: ``,
  })
  type: number;

  @ApiProperty({
    example: 'globalisation',
    type: String,
    description: ``,
  })
  topic: string;

  @ApiProperty({
    example: '2023-05-11T07:19:07.214Z',
    type: String,
    description: ``,
  })
  created_at: string;

  @ApiProperty({
    example: '2023-05-11T07:19:07.534Z',
    type: String,
    description: ``,
  })
  updated_at: string;

  @ApiProperty({
    example: 0,
    type: Number,
    description: ``,
  })
  __v: number;

  @ApiProperty({
    example: 0,
    type: Number,
    description: `
    0 : 테스트
    1 : 일반
    `,
  })
  mode: number;

  @ApiProperty({
    example: 1,
    type: Number,
    description: ``,
  })
  fluency_and_coherence: number;

  @ApiProperty({
    example: 1,
    type: Number,
    description: ``,
  })
  lexical_resource: number;

  @ApiProperty({
    example: 1,
    type: Number,
    description: ``,
  })
  grammatical_range_and_accuracy: number;

  @ApiProperty({
    example: [],
    type: [String],
    description: ``,
  })
  advices: [string];
}

export class ConversationsResponse {
  @ApiProperty({
    type: [ConversationModel],
  })
  conversations: [ConversationModel];
}

export class ConversationResponse {
  @ApiProperty({
    type: ConversationModel,
  })
  conversation: ConversationModel;
}

/// 시험결과 요약 응답 데이터
export class ExamSummaryResponse {
  @ApiProperty({
    example: 5.0,
    type: Number,
    description: `fluency_and_coherence의 평균 점수`,
    required: false,
  })
  fluency_and_coherence: number;

  @ApiProperty({
    example: 5.0,
    type: Number,
    description: `lexical_resource의 평균점수`,
    required: false,
  })
  lexical_resource: number;

  @ApiProperty({
    example: 5.0,
    type: Number,
    description: `grammatical_range_and_accuracy의 평균점수`,
    required: false,
  })
  grammatical_range_and_accuracy: number;

  @ApiProperty({
    example: 10,
    type: Number,
    description: `전체 시험 횟수`,
    required: false,
  })
  count: number;

  @ApiProperty({
    example: '2021-05-11T07:19:07.214Z',
    type: Date,
    description: `마지막 시험날짜`,
    required: false,
  })
  last_date: Date;
}
