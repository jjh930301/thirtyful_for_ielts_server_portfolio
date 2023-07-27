import { Injectable } from '@nestjs/common';
import { ServiceData } from 'src/models/service.data';
import { PromptProvider } from './prompt.provider';

@Injectable()
export class PromptService {
  constructor(
    private readonly promptPvd : PromptProvider
  ){}

  public async prompt() : Promise<ServiceData> {
    try {
      const prompt = await this.promptPvd.find();
      if(prompt) return ServiceData.ok(
        'Successfully getting prompts',
        {prompts : prompt},
        2000
      )
      return ServiceData.ok('Cannot upsert prompt' , {result : false} , 4001)
    } catch(e) {
      return ServiceData.serverError(e);
    }
  }
}
