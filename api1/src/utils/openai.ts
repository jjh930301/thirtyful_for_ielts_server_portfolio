import { AxiosResponse } from "@nestjs/terminus/dist/health-indicator/http/axios.interfaces";
import { Configuration, CreateChatCompletionRequest, CreateChatCompletionResponse, CreateCompletionRequest, CreateCompletionResponse, OpenAIApi } from "openai";
import { Constants } from "src/constants/constants";

export class OpenAi {

  static async completion(
    request : CreateCompletionRequest,
    token : number | null = null
  ) : Promise<import("axios").AxiosResponse<CreateCompletionResponse, any>> {
    request = {
      temperature : 0.7,
      max_tokens : token ? token : 256,
      ...request
    }
    return await new OpenAIApi(
      new Configuration({
        apiKey: Constants.OPEN_AI_KEY,
      })
    ).createCompletion(request)
  }

  static async chatCompletion(
    request : CreateChatCompletionRequest
  ) : Promise<import("axios").AxiosResponse<CreateChatCompletionResponse, any>> {
    request = {
      temperature : 0.7,
      max_tokens : 256,
      ...request
    }
    return await new OpenAIApi(
      new Configuration({
        apiKey: Constants.OPEN_AI_KEY,
      })
    ).createChatCompletion(request)
  }

}