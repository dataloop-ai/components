import { ILogger } from './ILogger'
import { ConsoleLogger } from './ConsoleLogger'
import { isVue2 } from 'vue-demi'

export { ILogger }

export const loggerFactory = (loggerName: string): ILogger =>
    new ConsoleLogger(loggerName)
