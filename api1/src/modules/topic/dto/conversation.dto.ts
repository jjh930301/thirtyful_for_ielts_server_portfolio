import { ApiProperty } from '@nestjs/swagger';
import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessageRoleEnum,
} from 'openai';

export class QuestionModel implements ChatCompletionRequestMessage {
  @ApiProperty({
    type: () => ChatCompletionResponseMessageRoleEnum,
    description: 'role',
    default: ChatCompletionResponseMessageRoleEnum.Assistant,
    enum: ChatCompletionResponseMessageRoleEnum,
  })
  role: ChatCompletionResponseMessageRoleEnum;

  @ApiProperty({
    type: String,
    description: 'content',
  })
  content: string;

  @ApiProperty({
    type: Date,
    description: `
      question prompt , answer submmit 시간
    `,
  })
  date_time: Date;
}

export class ConversationDto {
  @ApiProperty({
    type: String,
    required: false,
    description: `
      첫 질문 후 첫 답을 했을 때에 document가 생성되기 때문에
      첫 질문 후 답변에는 null로 보내주시면 됩니다.
    `,
  })
  conversation_id: string;

  @ApiProperty({
    type: String,
    required: true,
    description: `
      주제
    `,
  })
  topic: string;

  @ApiProperty({
    type: String,
    required: true,
    description: `
      부제
    `,
  })
  sub_topic: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: `
      0 : 연습모드,
      1 : 일반모드
    `,
  })
  mode: number;

  @ApiProperty({
    type: String,
    description: `
      가져온 prompt
    `,
    required: true,
  })
  prompt: string;

  @ApiProperty({
    type: String,
    description: `
      평가 prompt
    `,
    required: false,
  })
  evaluation_prompt: string;

  @ApiProperty({
    type: [QuestionModel],
    description: `
    date_time은 각각 question prompt , answer submmit 시간
    아래와 같은 형식으로 보내야 합니다.
    role : system은 prompt를 가지고 올때 첫번째 object로 들어가있습니다.
    [
      {
        "role": "assistant",
        "content": "string",
        "date_time": "2023-05-03T07:45:25.134Z"
      },
      {
        "role": "user",
        "content": "string",
        "date_time": "2023-05-03T07:46:25.134Z"
      }
    ]
    `,
  })
  conversations: [QuestionModel];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: `
      최근 답변의 mp3 file
    `,
  })
  audio: Express.Multer.File;
}
