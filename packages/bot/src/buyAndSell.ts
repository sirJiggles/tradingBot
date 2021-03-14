import { DataSet, Config } from './types'
import { peaking, sinking, tanking } from './utils'

type Action = {
  type: 'buy' | 'sell'
  symbol: 'string'
  amount: number
}

// the main config for the buy and sell functionality
// these values control how it will decide to do things
const config: Config = {
  // percentage shift up or down to think about doing anything
  threshold: 3,
  // percentage loss over all data history
  sinkingPercentage: 4,
  // percentage between each pull of the data shift
  peakingPercentage: 0.4,
  // percentage between each pull of the data shift
  tankingPercentage: -0.4,
}

const buyAndSell = (data: DataSet, symbols: Array<string>): DataSet => {
  return data.map((dataPoint, dataPointIndex) => {
    // get a bunch of actions we are going to maybe do
    // @TODO GARETH
    // need to only do one action, which is an array of actions
    // mark it as done, do nothing else but still return the data to be written to file
    const actions: Array<Action> = symbols.forEach((symbol) => {
      const percentage = dataPoint.data[symbol]

      if (percentage > config.threshold) {
        // if we already acted on this, do nothing
        if (dataPoint.actedUpon) {
          return
        }

        // check if peaking fast, if we are peaking fast do not sell
        if (peaking(data, symbol, dataPointIndex, config.peakingPercentage)) {
          return
        }

        // so we know not to act on this sell again later on
        dataPoint.actedUpon = true

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
            console.log(`not going to buy: ${symbolToBuy} she is tanking`)
            return
          }

          // if the one we are thinking of buying has been going down a while
          // also don't buy it (in our case if in all time we collect data by X%)
          if (sinking(data, symbolToBuy, config.sinkingPercentage)) {
            console.log(`not going to buy: ${symbolToBuy} she is sinking`)
            return
          }

          const percentageOfSymbolToBuy = dataPoint.data[symbolToBuy]
          // if the one we intend to buy is less than the one above the threshold
          // lets work out how much of it to buy up
          if (percentageOfSymbolToBuy < percentage) {
            const buyAmount = (percentage - percentageOfSymbolToBuy).toFixed(2)
            buyOrder += `BUY ${symbolToBuy} @ ${buyAmount}% \n`
            actions.push({
              type: 'buy',
              symbol: symbolToBuy,
              amount: buyAmount,
            })
          }
        })
        console.log(buyOrder)

        process.exit(1)
      }
    })

    // go through the actions and pick which one to take

    // data we are now doing to write back to file
    // we need to flag if we acted upon some data already, like a sell action
    // else we may do ot again later
    return dataPoint
  })
}

export { buyAndSell }
