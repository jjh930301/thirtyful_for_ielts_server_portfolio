import { Injectable } from '@nestjs/common';
import { ServiceData } from 'src/models/service.data';
import { AwsUtil } from 'src/utils/aws';
import { OpenAi } from 'src/utils/openai';
import { ConversationDto, QuestionModel } from './dto/conversation.dto';
import { ConversationDocment } from 'src/schemas/conversation.schema';
import { ConversationProvider } from '../conversation/conversation.provider';
import {
  ConversationLengthEnum,
  ConversationTypeEnum,
} from 'src/enums/conversation.type';
import { QuestionProvider } from '../question/question.provider';
import { EvaluationDto } from './dto/evaluation.dto';
import { GrammerEvaluationVO } from './vo/grammer.evaluation.vo';
import { SchemaNames } from 'src/constants/schema.names';
import { QuestionDocument } from 'src/schemas/question.schema';
import { PromptProvider } from '../prompt/prompt.provider';
import { ScoreEvaluationVO } from './vo/score_evaluation.vo';
import { ScoreEvaluationDto } from './dto/score_evaluation.dto';
import { TopicProvider } from './topic.provider';
import { PronounciationEvaluationVo } from './vo/pronounciation_evaluation.vo';
import { timeout } from '../../utils/timeout';
import axios from 'axios';

@Injectable()
export class TopicService {
  aws: AwsUtil = new AwsUtil();

  constructor(
    private readonly conversationPvd: ConversationProvider,
    private readonly questionPvd: QuestionProvider,
    private readonly promptPvd: PromptProvider,
    private readonly topicPvd: TopicProvider,
  ) {}

  public async getTopic(): Promise<ServiceData> {
    try {
      const topics = await this.topicPvd.getTopics(3);
      return ServiceData.ok('you have got successfully topic list', {
        topics,
      });
    } catch (e) {
      console.error(e);
      return ServiceData.serverError(e);
    }
  }

  public async getTopicListsByPart(): Promise<ServiceData> {
    try {
      const part_3 = await this.topicPvd.getTopics(3);
      const part_1 = await this.topicPvd.getTopics(1);
      const payload = {
        part_3,
        part_1,
      };

      return ServiceData.ok('you have got successfully topic list', payload);
    } catch (e) {
      console.error(e);
      return ServiceData.serverError(e);
    }
  }

  public async topicQuestion(prompt: string): Promise<ServiceData> {
    const ai = await OpenAi.chatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 256,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
    });
    try {
      return ServiceData.ok(
        'Successfully getting question',
        {
          sentence: ai.data.choices[0].message.content,
        },
        2000,
      );
    } catch (e) {
      return ServiceData.serverError(e);
    }
  }

  /// MARK: 대화를 평가한다
  public async evluateConversation(
    body: ScoreEvaluationDto,
    userId: string,
  ): Promise<ServiceData> {
    try {
      const conversation = await this.conversationPvd.findById(
        body.conversation_id,
      );

      if (!conversation) {
        return ServiceData.noModelFound('Conversation');
      }

      const prompt = await this.promptPvd.findByType(4);

      let text = 'Conversation: \n';

      const questions = conversation.questions as unknown as QuestionDocument[];
      for (const question of questions) {
        text += `Question: ${question.question}\nAnswer: ${question.original_answer}\n\n`;
      }

      text += prompt.prompt;

      // GPT-4를 사용하려면 ChatCompletion을 사용할수밖에 없다 현재까지는...
      const response = await OpenAi.chatCompletion({
        model: 'gpt-4-0314',
        temperature: 0.7,
        max_tokens: 256 * conversation.questions.length,
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
      });

      // 받아온 데이터를 json으로 파싱
      const json = JSON.parse(response.data.choices[0].message.content);
      const fluencyAndCoherence = json['fluency_and_coherence'] as number;
      const lexical_resource = json['lexical_resource'] as number;
      const grammatical_range_and_accuracy = json[
        'grammatical_range_and_accuracy'
      ] as number;

      const advices = json['advices'] as Array<string>;

      const scoreEvaluationVO = new ScoreEvaluationVO();
      scoreEvaluationVO.fluency_and_coherence = fluencyAndCoherence;
      scoreEvaluationVO.lexical_resource = lexical_resource;
      scoreEvaluationVO.grammatical_range_and_accuracy =
        grammatical_range_and_accuracy;
      scoreEvaluationVO.advices = advices;

      // Conversation이 가지고 있는 각 Question의 ielts score의 평균을 구한다.
      let prnScoreSum = 0;
      for (const question of questions) {
        prnScoreSum += Number(question.ielts) ?? 0;
      }

      // ieltsScoreAvg를 강제로 소숫점 1자리까지만 문자열로 표현
      const prnScoreAvg = Number((prnScoreSum / questions.length).toFixed(1));

      const updatedConversation = await this.conversationPvd.updateConversation(
        conversation._id,
        scoreEvaluationVO,
        prnScoreAvg,
      );

      return ServiceData.ok(
        'Successfully getting conversation',
        updatedConversation,
      );
    } catch (e) {
      return ServiceData.serverError(e);
    }
  }

  /// 질문에 대한 답변을 생성
  private async fetchQuestionEvaluation(
    question: string,
    answer: string,
    prompt: string,
  ): Promise<GrammerEvaluationVO> {
    let text = `id: id\nQuestion: ${question}\nAnswer: ${answer}\n\n${prompt}`;

    // GPT-4를 사용하려면 ChatCompletion을 사용할수밖에 없다 현재까지는...
    const response = await OpenAi.chatCompletion({
      model: 'gpt-4-0314',
      temperature: 0.7,
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
    });

    const json = JSON.parse(response.data.choices[0].message.content);
    const understandingQuestion = json.understanding_question == 'pass';

    const argumentJson = json.argument;
    const is_answer_valid = argumentJson.status == 'pass';
    const reasonForInvalidity = argumentJson.reason;

    const grammarErrorsFound = json.grammar_errors_found != 'pass';
    const correctedAnswer = json.corrected_answer;
    const paraphrasedAnswer = json.paraphrased_answer;

    const grammarEvaluationVO = new GrammerEvaluationVO();
    grammarEvaluationVO.grammar_errors_found = grammarErrorsFound;
    grammarEvaluationVO.corrected_answer = correctedAnswer;
    grammarEvaluationVO.paraphrased_answer = paraphrasedAnswer;
    grammarEvaluationVO.understand_question = understandingQuestion;
    grammarEvaluationVO.is_answer_valid = is_answer_valid;
    grammarEvaluationVO.reason_for_invalidity = reasonForInvalidity;

    return grammarEvaluationVO;
  }

  private async pushQuestion(
    answer: QuestionModel,
    question: QuestionModel,
    conversation: ConversationDocment,
    audioUrl: string,
    evaluationPrompt: string,
  ) {
    let evaluationVO: GrammerEvaluationVO;
    let pronounciationEvaluationVo: PronounciationEvaluationVo;
    try {
      if (evaluationPrompt) {
        evaluationVO = await this.fetchQuestionEvaluation(
          question.content,
          answer.content,
          evaluationPrompt,
        );
        const { data } = await axios.get(audioUrl, {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'audio/mp3',
          },
        });
  
        const buffer = Buffer.from(data);
        const base64data = buffer.toString('base64');
        const options = {
          method: 'POST',
          url: 'https://pronunciation-assessment1.p.rapidapi.com/pronunciation',
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': process.env.RAPID_API_HOST,
          },
          data: {
            audio_base64: base64data,
            audio_format: 'mp3',
            text: answer,
          },
        };
  
        const response = await axios.request(options);

        pronounciationEvaluationVo = await this.topicPvd.evaluateProunciationScore(
          response
        );
      }
    } catch (e) {
      await timeout(1000 * 10);
      await this.pushQuestion(
        answer,
        question,
        conversation,
        audioUrl,
        evaluationPrompt,
      );
    }
    try {
      const q = await this.questionPvd.createQuestion(
        answer,
        question,
        conversation,
        audioUrl,
        evaluationVO,
        pronounciationEvaluationVo,
      );
      await this.conversationPvd.pushQuestion(conversation, q);
    } catch (e) {
      console.log(e);
    }
  }

  public async conversation(userId: string, data: ConversationDto) {
    let conversation: ConversationDocment = null;
    let conversations = [];
    try {
      conversations = JSON.parse(data.conversations as unknown as string);
    } catch (e) {
      return ServiceData.invalidRequest(
        'conversations parse error',
        4004,
        'sentence',
      );
    }

    try {
      if (!data.conversation_id) {
        conversation = await this.conversationPvd.createConversation(
          userId,
          ConversationTypeEnum.ielts,
          data,
        );
      } else {
        conversation = await this.conversationPvd.findById(
          data.conversation_id,
        );
      }

      if (!conversation) {
        return ServiceData.invalidRequest('cannot found conversation id');
      }
      const audio = await this.aws.uploadAudio(userId, 'audio', data.audio);
      const prompt = await this.promptPvd.findByType(3);

      // 질문에 대한 답변을 생성은 비동기로 처리
      this.pushQuestion(
        conversations[conversations.length - ConversationLengthEnum.answer],
        conversations[conversations.length - ConversationLengthEnum.question],
        conversation,
        audio,
        prompt.prompt,
      );

      // 바로 새로운 질문을 생성하고 응답
      const messages = conversations.map((c) => {
        return {
          role: c.role,
          content: c.content,
        };
      });

      const ai = await OpenAi.chatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: data.prompt,
          },
          ...messages,
        ],
      });

      return ServiceData.ok(
        'Successfully conversation with openai',
        {
          conversation_id: conversation._id,
          sentence: ai.data.choices[0].message.content,
          audio_url: audio,
        },
        2000,
      );
    } catch (e) {
      console.log(e);
      return ServiceData.serverError(e);
    }
  }

  public async evaluation(data: EvaluationDto, userId: string) {
    try {
      let text = ``;
      const conversation = await this.conversationPvd.findById(
        data.conversation_id,
      );
      await conversation.populate({
        path: SchemaNames.question,
      });
      conversation.questions.forEach((q) => {
        text += `QuestionID: ${q['_id']} \n`;
        text += `Teacher: ${q['question']} \n`;
        text += `User: ${q['original_answer']} \n\n`;
      });
      const ai1 = OpenAi.completion(
        {
          model: 'text-davinci-003',
          prompt: text + `\n${data.prompt}`,
        },
        256 * conversation.questions.length,
      );

      const grammer = await ai1;
      const grammerJson = JSON.parse(
        grammer.data.choices[0].text,
      ) as unknown as GrammerEvaluationVO[];
      const questions = conversation.questions as unknown as QuestionDocument[];
      const newQuestion = await Promise.all(
        questions.map(async (q, i) => {
          return await this.questionPvd.updateQuestion(q, grammerJson[i]);
        }),
      ).then((result) => {
        return result;
      });

      return ServiceData.ok(
        'Successfully getting evaluations',
        {
          conversation: {
            _id: conversation._id,
            user: conversation.user,
            questions: newQuestion,
            type: conversation.type,
            topic: conversation.topic,
            created_at: conversation['created_at'],
            updated_at: conversation['updated_at'],
          },
          // score : scoreJson
        },
        2000,
      );
    } catch (e) {
      await timeout(1000 * 10);
      return await this.evaluation(data, userId);
    }
  }
}
