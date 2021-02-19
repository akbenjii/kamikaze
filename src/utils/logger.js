'use strict'

const {keepLogs} = require('../../config');
const {createLogger, transports, format, addColors} = require('winston')
const {combine, colorize, timestamp, json, printf} = format

require('winston-daily-rotate-file')
addColors({incoming: 'bold white blueBG', outgoing: 'bold white redBG'})

const textFormat = printf(({level, message, timestamp}) => {
    return `[\x1b[36m${timestamp}\x1b[0m] [${level}] \x1b[35m>\x1b[0m ${message}`
})
const {debug} = createLogger({
    levels: {debug: 7},
    transports: [
        new transports.DailyRotateFile({
            level: 'debug',
            maxFiles: keepLogs.debug,
            filename: `./logs/debug@%DATE%.log`,
            datePattern: 'D-M-YYYY',
            format: combine(timestamp({format: 'HH:mm:ss'}), json())
        }),
        new transports.Console({
            level: 'debug',
            format: combine(colorize(), timestamp({format: 'HH:mm:ss'}), textFormat),
        })
    ]
})

const {info} = createLogger({
    levels: {info: 6},
    transports: [
        new transports.DailyRotateFile({
            level: 'info',
            maxFiles: keepLogs.info,
            filename: `./logs/info@%DATE%.log`,
            datePattern: 'D-M-YYYY',
            format: combine(timestamp({format: 'HH:mm:ss'}), json())
        }),
        new transports.Console({
            level: 'info',
            format: combine(colorize(), timestamp({format: 'HH:mm:ss'}), textFormat)
        })
    ]
})

const {warn} = createLogger({
    levels: {warn: 4},
    transports: [
        new transports.DailyRotateFile({
            level: 'warn',
            maxFiles: keepLogs.warn,
            filename: `./logs/warn@%DATE%.log`,
            datePattern: 'D-M-YYYY',
            format: combine(timestamp({format: 'HH:mm:ss'}), json())
        }),
        new transports.Console({
            level: 'warn',
            format: combine(colorize(), timestamp({format: 'HH:mm:ss'}), textFormat)
        })
    ]
})

const {error} = createLogger({
    levels: {error: 3},
    transports: [
        new transports.DailyRotateFile({
            level: 'error',
            maxFiles: keepLogs.error,
            filename: `./logs/error@%DATE%.log`,
            datePattern: 'D-M-YYYY',
            format: combine(timestamp({format: 'HH:mm:ss'}), json())
        }),
        new transports.Console({
            level: 'error',
            format: combine(colorize(), timestamp({format: 'HH:mm:ss'}), textFormat)
        })
    ]
})

const {incoming} = createLogger({
    levels: {incoming: 6},
    transports: [
        new transports.DailyRotateFile({
            level: 'incoming',
            maxFiles: keepLogs.incoming,
            filename: `./logs/incoming@%DATE%.log`,
            datePattern: 'D-M-YYYY',
            format: combine(timestamp({format: 'HH:mm:ss'}), json())
        }),
        new transports.Console({
            level: 'incoming',
            format: combine(colorize(), timestamp({format: 'HH:mm:ss'}), textFormat),
        })
    ]
})

const {outgoing} = createLogger({
    levels: {outgoing: 6},
    transports: [
        new transports.DailyRotateFile({
            level: 'outgoing',
            maxFiles: keepLogs.outgoing,
            filename: `./logs/outgoing@%DATE%.log`,
            datePattern: 'D-M-YYYY',
            format: combine(timestamp({format: 'HH:mm:ss'}), json())
        }),
        new transports.Console({
            level: 'outgoing',
            format: combine(colorize(), timestamp({format: 'HH:mm:ss'}), textFormat),
        })
    ]
})

module.exports = {
    debug: (msg) => debug(msg),
    info: (msg) => info(msg),
    warn: (msg) => warn(msg),
    error: (msg) => error(msg),
    incoming: (msg) => incoming(msg),
    outgoing: (msg) => outgoing(msg)
}