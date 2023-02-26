import { isVue2 } from 'vue-demi'
import { ILogger } from './ILogger'

export enum logLevels {
    NON = 'non',
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug'
}
export class ConsoleLogger extends ILogger {
    public static LOG_LEVEL: logLevels = logLevels.DEBUG

    private _shouldLogLevel(logLevel: logLevels): boolean {
        const logLevelOrder = [
            logLevels.NON,
            logLevels.ERROR,
            logLevels.WARN,
            logLevels.INFO,
            logLevels.DEBUG
        ]
        return (
            logLevelOrder.indexOf(logLevel) <=
            logLevelOrder.indexOf(ConsoleLogger.LOG_LEVEL)
        )
    }

    constructor(loggerName: string) {
        super(loggerName)
    }
    private _timestamp() {
        return new Date().toISOString()
    }
    private _logMessage(level: string, message: string, metadata: any) {
        message = `[${this._timestamp()}] [${this._name}] - ${message}`
        if (metadata) {
            // @ts-ignore
            console[level](message, metadata)
        } else {
            // @ts-ignore
            console[level](message)
        }
    }

    public debug(message: string, metadata?: any) {
        if (this._shouldLogLevel(logLevels.DEBUG)) {
            this._logMessage('debug', message, metadata)
        }
    }
    public info(message: string, metadata?: any) {
        if (this._shouldLogLevel(logLevels.INFO)) {
            this._logMessage('log', message, metadata)
        }
    }
    public warn(message: string, metadata?: any) {
        if (this._shouldLogLevel(logLevels.WARN)) {
            this._logMessage('warn', message, metadata)
        }
    }
    public error(message: string, metadata?: any) {
        if (this._shouldLogLevel(logLevels.ERROR)) {
            this._logMessage('error', message, metadata)
        }
    }
}
