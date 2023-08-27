import * as log4js from 'log4js'

const date = new Date().toISOString().substring(0, 10)
log4js.configure({
  appenders: {
    debug: { type: 'file', filename: `log/${date}/debug.log` },
  },
  categories: {
    default: { appenders: ['debug'], level: 'debug', enableCallStack: false },
  },
})

export const logger = log4js.getLogger('debug')
logger.level = 'debug'

export default logger
