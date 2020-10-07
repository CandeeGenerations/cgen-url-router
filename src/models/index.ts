export interface ShortUrlModel {
  _id: string
  _ts: string
  fullUrl: string
  shortCode?: string
  addedTs: string
}

export interface Click {
  urlId: string
  clickedTs: string
  ipAddress?: string
  language?: string
  userAgent?: string
  country?: string
  region?: string
  city?: string
}

export interface ClickModel extends Click {
  _id: string
  _ts: string
}

export interface FindShortUrlModel {
  findShortUrl: ShortUrlModel
}

export interface CreateClickModel {
  createClick: ClickModel
}
