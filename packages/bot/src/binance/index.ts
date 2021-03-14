import Binance, {
  Binance as BinanceClient,
  DailyStatsResult,
} from 'binance-api-node'

import { CoinStats } from '../types'

let client: BinanceClient

// get stats for all the coins passed
const getPercentages = async (coins: Array<string>): Promise<CoinStats> => {
  const percentageChanges: CoinStats = {}

  try {
    // go through each coin and get the daily stats of it
    for (const coin of coins) {
      const { priceChangePercent, symbol } = (await client.dailyStats({
        symbol: `${coin}USDT`,
      })) as DailyStatsResult

      percentageChanges[symbol] = parseFloat(priceChangePercent)
    }

    return percentageChanges
  } catch (error) {
    throw new Error(`could not get info from binance: ${error}`)
  }
}

const connect = async () => {
  client = Binance({
    apiKey: process.env.BINANCE_KEY,
    apiSecret: process.env.BINANCE_SECRET,
  })
}

export { connect, getPercentages }
