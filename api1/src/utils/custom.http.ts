import { HttpService } from "@nestjs/axios";
import { AxiosRequestHeaders, AxiosResponse } from "axios";
import { lastValueFrom , map} from "rxjs";
import { Constants } from "src/constants/constants";
import { Urls } from "src/constants/urls";
import { HTTP_TIMEOUT } from "src/utils/timeout";

export class CustomHttp {
  private baseUrl : string;
  private header : AxiosRequestHeaders;
  constructor(
    base_url : string,
    header : AxiosRequestHeaders | null = null,
    private readonly httpSvc : HttpService | null = new HttpService
  ) {
    this.baseUrl = base_url
    this.header = header
  }

  async get(
    endPoint : string,
    params : Object | null = {},
    data : any | null = {},
  ) : Promise<AxiosResponse<any> | number> {
    try {
      return await lastValueFrom(await this.httpSvc.get(
        `${this.baseUrl}/${endPoint}` ,
        {
          headers : this.header,
          params : params,
          timeout : HTTP_TIMEOUT,
          data : data
        }
      ).pipe(map(({data}) => data)))
    } catch(e) {
      return e.response.status ? e.response.status : 400
    }
  }

  async post(
    endPoint : string , 
    body : Object | null = {} , 
    params : Object | null = {}
  ) : Promise<AxiosResponse<any> | number> {
    try {
      return await lastValueFrom(await this.httpSvc.post(
        `${this.baseUrl}/${endPoint}` ,
        {
          ...body
        },
        {
          headers : this.header,
          params : params,
          timeout : HTTP_TIMEOUT
        },
      ).pipe(map(({data}) => data)))
    } catch(e) {
      return e?.response?.status ? e?.response?.status : 400
    }
  }
}