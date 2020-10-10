import * as dayjs from 'dayjs'
import {ConfigService} from '@nestjs/config'
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Redirect,
  Render,
} from '@nestjs/common'

import {ILogger} from 'src/logging'
import {AppService} from './app.service'

export interface UrlModel {
  success: boolean
  ipUrl?: string
  url?: string
  id?: string
}

export interface ClickModel {
  urlId: string
  userAgent?: string
  ipAddress?: string
  language?: string
  country?: string
  region?: string
  city?: string
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Inject('ILogger')
  logger: ILogger

  @Get()
  @Redirect(process.env.BASE_URL, 301)
  load() {
    return {url: process.env.BASE_URL}
  }

  @Get(':shortCode')
  @Render('index')
  async getRedirectUrl(
    @Param('shortCode') shortCode: string,
  ): Promise<UrlModel> {
    const baseUrl = this.configService.get<string>('BASE_URL')
    const ipUrl = this.configService.get<string>('IP_URL')
    const ipKey = this.configService.get<string>('IP_KEY')
    const shortUrl = await this.appService.findShortUrl(shortCode)

    if (!shortUrl) {
      this.logger.error(`Short code not found (${shortCode})`)

      return {
        success: false,
        url: escape(`${baseUrl}?e=notFound&c=${shortCode}`),
      }
    }

    const url = `${shortUrl.fullUrl}?ref=cgen.cc`

    this.logger.info(
      `Found short code (${shortCode}) - Redirecting to : ${url}`,
    )

    return {
      success: true,
      url: escape(url),
      id: shortUrl._id,
      ipUrl: escape(`${ipUrl}?auth=${ipKey}`),
    }
  }

  @Post('click')
  async recordClick(@Body() body: ClickModel): Promise<UrlModel> {
    const baseUrl = this.configService.get<string>('BASE_URL')

    try {
      await this.appService.createClick({
        clickedTs: dayjs()
          .valueOf()
          .toString(),
        urlId: body.urlId,
        userAgent: body.userAgent || 'Unknown',
        ipAddress: body.ipAddress || 'Unknown',
        language: body.language || 'Unknown',
        country: body.country || 'Unknown',
        region: body.region || 'Unknown',
        city: body.city || 'Unknown',
      })

      return {success: true}
    } catch {
      return {success: false, url: escape(`${baseUrl}?e=true`)}
    }
  }
}
