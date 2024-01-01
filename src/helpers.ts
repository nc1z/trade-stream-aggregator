import logger from './logger'
import { Exchange } from './types'

export function logTrade(exchange: Exchange, price: number, quantity: number, time: number) {
    const size = price * quantity
    const absoluteSize = Math.abs(size)
    let formattedSize: string

    const isWhale = absoluteSize >= 1e6
    const isFish = absoluteSize >= 1e2

    switch (true) {
        case isWhale:
            formattedSize = (absoluteSize / 1e6).toFixed(1) + 'M'
            break
        case isFish:
            formattedSize = (absoluteSize / 1e3).toFixed(1) + 'K'
            break
        default:
            formattedSize = (absoluteSize / 1e3).toFixed(2) + 'K'
            break
    }
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }
    const currentTime = new Date(time).toLocaleTimeString(undefined, options)
    const formattedSizeWithPadding = padSpacing(`[${formattedSize}]`, 8)
    const sizeIndicator = getSizeIndicator(absoluteSize)
    const formattedExchangeWithPadding = padSpacing(`[${exchange}]`, 9)
    const orderType = size < 0 ? `[SELL]` : `[BUY]`
    const formattedOrderTypeWithPadding = padSpacing(orderType, 6)

    const log = `[${currentTime}] ${formattedExchangeWithPadding} ${formattedOrderTypeWithPadding} ${price.toFixed(
        0,
    )} ${formattedSizeWithPadding} ${sizeIndicator}`

    logger.info(log)
}

function getSizeIndicator(size: number) {
    const maxBarLength = 20
    const scaledSize = size / 1e6
    const barLength = Math.min(Math.ceil(scaledSize * maxBarLength), maxBarLength)
    return '[' + '='.repeat(barLength) + ' '.repeat(maxBarLength - barLength) + ']'
}

function padSpacing(text: string, totalLength: number) {
    const paddingLength = Math.max(totalLength - text.length, 0)
    const padding = ' '.repeat(paddingLength)
    return `${text}${padding}`
}

export function arrayBufferToString(data: ArrayBuffer) {
    const decoder = new TextDecoder()
    return decoder.decode(data)
}
