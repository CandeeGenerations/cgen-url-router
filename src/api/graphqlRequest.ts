import 'cross-fetch/polyfill'
import {GraphQLClient} from 'graphql-request'

export const getGQLClient = (): GraphQLClient =>
  new GraphQLClient(process.env.GRAPHQL_URL, {
    headers: {Authorization: `Bearer ${process.env.GRAPHQL_AUTH_KEY}`},
  })
