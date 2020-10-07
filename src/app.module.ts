import * as morgan from 'morgan'
import {ConfigModule} from '@nestjs/config'
import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common'

import {AppService} from './app.service'
import {AppController} from './app.controller'
import {logProviders, getLogger} from './logging'
import {enableDebugLogging} from './logging/constants'

const morganLogger = getLogger()
const morganLogStream = {
  write: (message: string): void => {
    morganLogger.debug(message)
  },
}

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ...logProviders],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    if (enableDebugLogging) {
      consumer.apply(morgan('dev', {stream: morganLogStream})).forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      })
    }
  }
}
