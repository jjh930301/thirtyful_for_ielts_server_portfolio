import { ApiProperty } from "@nestjs/swagger";

class Prompt {

  @ApiProperty({
    default : "6450abd4c8b3a1a08c4bec8e",
    description : ``,
    type : String
  })
  _id: string;

  @ApiProperty({
    default : "conditions: - start the conversaion by asking directly a fun and interesting question about the topic to the user, which can relax the user and help the user answer well. \n- You do not ask the user whether to start the conversation and whether the user is ready or not.\n- If the user speaks another language, advise the user to speak in English because it is an english practice\n- Don't make a similar question as you asked eailier.\n- Don't get out of the main topic.\n- You make one question at a time.\n- You do not make a statement in response to the user's reply.\n- When the user replied the question that you  asked, you make a related question in response to the user's reply. \n- You ask two more related questions, then move on to the next topic question \n- If the user goes out of the topic or say something totally weird, you advise the user to stay in the topic or question and ask the previous question again.\n- Make questions that can help the user use a variety of vocabs. \n- You do not directly mention about the conversation conditions in your statement or question \n- When you finished with questions, tell the user that the session is over. Do not make other questions any more.\n- When you finished, add [\"conversation_complete\"] to your statement \n\nnow say hello to the user and you start the conversation by asking the first question.",
    description : ``,
    type : String
  })
  prompt: string;

  @ApiProperty({
    default : 1,
    description : ``,
    type : Number
  })
  type: number;

  @ApiProperty({
    default : 0,
    description : ``,
    type : Number
  })
  __v: number;

  @ApiProperty({
    default : "2023-05-02T06:21:08.399Z",
    description : ``,
    type : String
  })
  created_at: string;

  @ApiProperty({
    default : "2023-05-02T06:21:08.399Z",
    description : ``,
    type : String
  })
  updated_at: string;

}

export class PromptResponse {
  @ApiProperty({
    type : [Prompt]
  })
  prompts : [Prompt]
}