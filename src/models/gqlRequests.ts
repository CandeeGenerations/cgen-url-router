import {gql} from 'graphql-request'

export const FIND_SHORT_URL = gql`
  query FindShortUrl($shortCode: String!) {
    findShortUrl(shortCode: $shortCode) {
      _id
      _ts
      shortCode
      fullUrl
      addedTs
    }
  }
`

export const CREATE_CLICK = gql`
  mutation CreateClick($input: ClickInput!) {
    createClick(data: $input) {
      _id
      _ts
      urlId
      clickedTs
      language
      userAgent
      ipAddress
      country
      region
      city
    }
  }
`
