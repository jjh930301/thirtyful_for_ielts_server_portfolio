import { Injectable } from '@nestjs/common';
import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SchemaNames } from 'src/constants/schema.names';
import { TopicDocument, TopicSchema } from 'src/schemas/topic.schema';
import { SubTopicDocument, SubTopicSchema } from 'src/schemas/sub_topic.schema';
import { OpenAi } from 'src/utils/openai';
import {
  ConversationDocment,
  ConversationSchema,
} from 'src/schemas/conversation.schema';
import axios from 'axios';
import { PronounciationEvaluationVo } from './vo/pronounciation_evaluation.vo';

@Injectable()
export class TopicProvider {
  static models: ModelDefinition[] = [
    { schema: TopicSchema, name: SchemaNames.topic },
    { schema: SubTopicSchema, name: SchemaNames.subTopics },
    { schema: ConversationSchema, name: SchemaNames.conversation },
  ];

  constructor(
    @InjectModel(SchemaNames.topic)
    private readonly topicModel: Model<TopicDocument>,
    @InjectModel(SchemaNames.subTopics)
    private readonly subTopicModel: Model<SubTopicDocument>,
    @InjectModel(SchemaNames.conversation)
    private readonly conversationModel: Model<ConversationDocment>,
  ) {}

  public async createTopic(topic: string, part: number) {
    // topic 생성
    const t = await this.topicModel.create([
      {
        part: part,
        name: topic,
      },
    ]);

    const sub_topics = await this.requestSubTopics(t[0]._id, part);

    const subtopics = [];
    for (const st of sub_topics) {
      const subtopic = await this.subTopicModel.create({
        topic: t[0]._id,
        name: st,
      });

      subtopics.push(subtopic._id);
    }

    // topic에 sub_topic 추가

    const topic_sub_topics = await this.topicModel.findByIdAndUpdate(
      t[0]._id,
      {
        $push: {
          sub_topics: subtopics,
        },
      },
      { new: true },
    );

    return t;
  }

  /// 발음평가
  async evaluateProunciationScore(
    response : any
  ): Promise<PronounciationEvaluationVo> {
    try {
      const score = response.data.score;
      const accent_predictions = response.data.accent_predictions;
      const en_US = accent_predictions.en_US;
      const en_UK = accent_predictions.en_UK;
      const en_AU = accent_predictions.en_AU;

      const score_estimates = response.data.score_estimates;
      const ielts = score_estimates.ielts;
      const toefl = score_estimates.toefl;
      const cefr = score_estimates.cefr;
      const pte_general = score_estimates.pte_general;

      const words = response.data.words;

      return new PronounciationEvaluationVo(
        score,
        en_US,
        en_UK,
        en_AU,
        ielts,
        toefl,
        cefr,
        pte_general,
        words,
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  blobToBase64(blob, callback) {
    var reader = new FileReader();
    reader.onload = function () {
      var dataUrl = reader.result as string;
      var base64 = dataUrl.split(',')[1];
      callback(base64);
    };
    reader.readAsDataURL(blob);
  }

  private async requestSubTopics(
    topic: string,
    part: number,
  ): Promise<Array<string>> {
    const prmopt = `create 10 sub-topics for intermediate students about the topic ${topic} to practise IELTS speaking part ${part}. (only sub-topics, not questions). Make a response in a json format with the key "sub_topics" and the value is an array of string.`;

    const response = await OpenAi.chatCompletion({
      model: 'gpt-4-0314',
      temperature: 0.7,
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prmopt,
        },
      ],
    });

    const json = JSON.parse(response.data.choices[0].message.content);
    return json.sub_topics;
  }

  /// 토픽 가져오기
  public async getTopics(part: number): Promise<Array<TopicDocument>> {
    try {
      return await this.topicModel.aggregate([
        {
          $match: {
            part: part,
            $nor: [
              {
                status: 0,
              },
            ],
          },
        },
        {
          $lookup: {
            from: SchemaNames.subTopics,
            localField: 'sub_topics',
            foreignField: '_id',
            as: 'sub_topics',
            pipeline: [
              {
                $project: {
                  name: 1,
                  part: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            name: 1,
            sub_topics: '$sub_topics.name',
          },
        },
      ]);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
