import { fakeData } from './fakeData'
import * as fs from 'fs'
import { DataSet } from './types'
import { peaking } from './peaking'

// what percentage up or down will trigger a trade?
const threshold = 3

const symbols = ['BTC', 'ETH', 'GSUS']

let data: DataSet

const getData = () => {
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
  getData()

  // write the data to a file to check up on it later
  fs.writeFileSync(`${__dirname}/data.json`, JSON.stringify(data))

  // @todo maybe in reverse order?
  data.forEach((dataPoint, dataPointIndex) => {
    // check each coin to see if it is above or below
    symbols.forEach((symbol) => {
      const percentage = dataPoint.data[symbol]

      if (percentage > threshold) {
        // check if peaking fast, if we are peaking fast do not sell
        if (peaking(data, symbol, dataPointIndex)) {
          console.log('we are peaking so we should not sell')
          return
        }

        console.log(JSON.stringify(dataPoint, null, 2))

        console.log(`SELL ${symbol}`)
        let buyOrder = ``
        const filteredSymbols = symbols.filter((s) => s !== symbol)
        filteredSymbols.forEach((symbolToBuy) => {
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
