import { fakeData } from './utils/fakeData'
import * as fs from 'fs'
import { DataSet, Config } from './types'
import { peaking, sinking, tanking } from './utils'

// the main config for the program
// these values control how it will decide to do things
const config: Config = {
  threshold: 3,
  sinkingPercentage: 4,
  peakingPercentage: 0.4,
  tankingPercentage: -0.4,
}

const symbols = ['BTC', 'ETH', 'GSUS']

let data: DataSet

const getFakeData = () => {
  // lets fake some data to test
  const speeds = [4, 3, 0.2]
  const directions = [0.1, -0.1, -0.1]

  data = fakeData({
    symbols,
    speeds,
    directions,
    amount: 90,
  })
}

const run = async () => {
  // for now we get some fake data, we will get old data + a new entry from the API
  // when we have it connected to binance
  getFakeData()

  // write the data to a file to check up on it later
  fs.writeFileSync(`${__dirname}/data.json`, JSON.stringify(data))

  // @todo maybe in reverse order?
  data.forEach((dataPoint, dataPointIndex) => {
    // check each coin to see if it is above or below
    symbols.forEach((symbol) => {
      const percentage = dataPoint.data[symbol]

      if (percentage > config.threshold) {
        // check if peaking fast, if we are peaking fast do not sell
        if (peaking(data, symbol, dataPointIndex, config.peakingPercentage)) {
          return
        }

        console.log(JSON.stringify(dataPoint, null, 2))

        console.log(`SELL ${symbol}`)
        let buyOrder = ``

        // filter out the symbol that is gaining in value
        const filteredSymbols = symbols.filter((s) => s !== symbol)

        // go through all the other coins
        filteredSymbols.forEach((symbolToBuy) => {
          // if the one we are thinking of buying is tanking. DO NOT BUY IT
          if (
            tanking(data, symbolToBuy, dataPointIndex, config.tankingPercentage)
          ) {
            return
          }

          // if the one we are thinking of buying has been going down a while
          // also don't buy it (in our case if in all time we collect data by 4%)
          if (sinking(data, symbolToBuy, config.sinkingPercentage)) {
            return
          }

          const percentageOfSymbolToBuy = dataPoint.data[symbolToBuy]
          // if the one we intend to buy is less than the one above the threshold
          // lets work out how much of it to buy up
          if (percentageOfSymbolToBuy < percentage) {
            const buyAmount = (percentage - percentageOfSymbolToBuy).toFixed(2)
            buyOrder += `BUY ${symbolToBuy}: ${buyAmount}% \n`
          }
        })
        console.log(buyOrder)

        process.exit(1)
      }
    })
  })

  // connect to binance
  // connect()
  // get some percentage data
  // const percentages = await getPercentages(['BTC', 'LTC', 'ETH'])

  // 60, 40, 3
}

export { run }
