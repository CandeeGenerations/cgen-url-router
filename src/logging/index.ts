import {Provider} from '@nestjs/common'

import {createLogger, getProvider} from './winston'

const parentLogger = createLogger()

export type ILogger = typeof parentLogger

export const logProviders: Provider[] = [
  // this allows class based access
  {
    provide: parentLogger,
    useValue: parentLogger,
  },
  // this allows string based access
  {
    provide: 'ILogger',
    useExisting: parentLogger,
  },
  // this hooks into Nest directly (they use a different logging interface)
  getProvider(parentLogger),
]

export function getLogger(): ILogger {
  return parentLogger
}
