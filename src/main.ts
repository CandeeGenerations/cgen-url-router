import * as dotenv from 'dotenv'
import {NestFactory} from '@nestjs/core'

import {ILogger} from './logging'
import {AppModule} from './app.module'
import {NEST_LOGGER_NAME} from './logging/constants'
import {NestExpressApplication} from '@nestjs/platform-express'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  })
  const log = app.get<ILogger>('ILogger')
  const port = app.get('ConfigService').get('PORT') || 3002

  app.useLogger(app.get(NEST_LOGGER_NAME))
  app.set('trust proxy', true)

  log.info(`Listening on PORT: ${port}`)

  await app.listen(port)
}
bootstrap()
