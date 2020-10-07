import * as dayjs from 'dayjs'
import * as geoip from 'geoip-lite'
import {Request} from 'express'
import {ConfigService} from '@nestjs/config'
import {Controller, Get, Inject, Param, Redirect, Req} from '@nestjs/common'

import {ILogger} from 'src/logging'
import {AppService} from './app.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Inject('ILogger')
  logger: ILogger

  @Get(':shortCode')
  @Redirect(process.env.BASE_URL, 302)
  async getRedirectUrl(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
  ): Promise<{url: string}> {
    const baseUrl = this.configService.get<string>('BASE_URL')
    const shortUrl = await this.appService.findShortUrl(shortCode)

    if (!shortUrl) {
      this.logger.error(`Short code not found (${shortCode})`)

      return {url: `${baseUrl}?e=notFound&c=${shortCode}`}
    }

    const geo = geoip.lookup(req.ip)

    await this.appService.createClick({
      clickedTs: dayjs()
        .unix()
        .toString(),
      urlId: shortUrl._id,
      userAgent: req.headers['user-agent'] || 'Unknown',
      ipAddress: JSON.stringify(req.ip) || 'Unknown',
      language: req.headers['accept-language'] || 'Unknown',
      country: geo ? geo.country : 'Unknown',
      region: geo ? geo.region : 'Unknown',
      city: geo ? geo.city : 'Unknown',
    })

    const url = `${shortUrl.fullUrl}?ref=cgen.cc`

    this.logger.info(
      `Found short code (${shortCode}) - Redirecting to : ${url}`,
    )

    return {url}
  }
}
