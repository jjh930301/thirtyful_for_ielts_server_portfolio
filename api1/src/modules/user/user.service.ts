import { Injectable } from '@nestjs/common';
import { ServiceData } from 'src/models/service.data';
import { ConversationProvider } from '../conversation/conversation.provider';
import { PaginationDto } from './dto/pagination.dto';
import { UserProvider } from './user.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly conversationPvd: ConversationProvider,
    private readonly userPvd: UserProvider,
  ) {}

  public async conversations(userId: string, query: PaginationDto) {
    try {
      const conversations = await this.conversationPvd.findByUserId(
        userId,
        query,
      );
      return ServiceData.ok(
        'Successfully getting conversations',
        {
          conversations: conversations,
        },
        2000,
      );
    } catch (e) {
      return ServiceData.serverError(e);
    }
  }

  public async evaluation(conversationId: string): Promise<ServiceData> {
    try {
      const evaluation = await this.conversationPvd.aggregateById(
        conversationId,
      );
      if (!evaluation) return ServiceData.noModelFound('conversaion');
      return ServiceData.ok(
        'Successfully getting conversation',
        { conversation: evaluation },
        2000,
      );
    } catch (e) {
      return ServiceData.serverError(e);
    }
  }

  public async withdrawn(userId: string): Promise<ServiceData> {
    try {
      const user = await this.userPvd.findByIdAndUpdate(userId, 'type', 0);
      if (user)
        return ServiceData.ok(
          'Successfully delete user',
          { result: true },
          2000,
        );
      return ServiceData.timeout();
    } catch (e) {
      return ServiceData.serverError(e);
    }
  }

  public async getExamSummary(userId: string): Promise<ServiceData> {
    try {
      const summary = await this.conversationPvd.getExamSummary(userId);
      return ServiceData.ok('Successfully get exam summary', summary, 2000);
    } catch (e) {
      return ServiceData.serverError(e);
    }
  }
}
