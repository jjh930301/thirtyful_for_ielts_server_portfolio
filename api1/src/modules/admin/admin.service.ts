import { Injectable } from '@nestjs/common';
import { ServiceData } from 'src/models/service.data';
import { PromptProvider } from '../prompt/prompt.provider';
import { CreatePromptDto } from './dto/create.prompt.dto';
import { TopicProvider } from '../topic/topic.provider';
import { CreateTopicDto } from './dto/create.topic.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly promptPvd: PromptProvider,
    private readonly topicPvd: TopicProvider,
  ) {}

  public async prompt(body: CreatePromptDto): Promise<ServiceData> {
    try {
      const prompt = await this.promptPvd.upsert(body);
      if (prompt)
        return ServiceData.ok(
          'Successfully getting prompts',
          { result: true },
          2001,
        );
      return ServiceData.ok('Cannot upsert prompt', { result: false }, 4001);
    } catch (e) {
      return ServiceData.serverError(e);
    }
  }

  public async insertTopics(query: CreateTopicDto): Promise<ServiceData> {
    try {
      await this.topicPvd.createTopic(query.topic, query.part);
      return ServiceData.ok('Successfully inserting topics', { result: true });
    } catch (e) {
      return ServiceData.serverError(e);
    }
  }
}
