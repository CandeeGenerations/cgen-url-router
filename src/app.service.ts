import {Injectable} from '@nestjs/common'
import {GraphQLClient} from 'graphql-request'

import {getGQLClient} from './api/graphqlRequest'
import {FIND_SHORT_URL, CREATE_CLICK} from './models/gqlRequests'
import {
  ShortUrlModel,
  FindShortUrlModel,
  Click,
  ClickModel,
  CreateClickModel,
} from './models'

@Injectable()
export class AppService {
  private gqlClient: GraphQLClient

  constructor() {
    this.gqlClient = getGQLClient()
  }

  async findShortUrl(shortCode: string): Promise<ShortUrlModel> {
    const response = await this.gqlClient.request<FindShortUrlModel>(
      FIND_SHORT_URL,
      {shortCode},
    )

    return response.findShortUrl
  }

  async createClick(input: Click): Promise<ClickModel> {
    const response = await this.gqlClient.request<CreateClickModel>(
      CREATE_CLICK,
      {input},
    )

    return response.createClick
  }
}
