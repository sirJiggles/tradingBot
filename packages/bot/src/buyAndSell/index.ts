import { DataSet, Config, Action } from '../types'
import { peaking } from './peaking'
import { sinking } from './sinking'
import { tanking } from './tanking'
import { takeHighestSeller } from './takeHighestSeller'

const buyAndSell = (
  data: DataSet,
  symbols: Array<string>,
  config: Config,
  distanceFromEnd = 1,
): Array<Action> => {
  // the data point we are going to look at, by default the last one
  const dataPointIndex = data.length - distanceFromEnd
  const dataPoint = data[dataPointIndex]

  // go through all the coins we are working with
  const actions: Array<Array<Action>> = []

  symbols.forEach((symbol) => {
    // what is the percentage of the coin we are looking at?
    const percentage = dataPoint.data[symbol].percentChange
    const symbolActions: Array<Action> = []

    // is it above the threshold?
    if (percentage < config.threshold) {
      // console.log('less than threshold')
      // JSON.stringify(console.log(dataPoint.data), null, 2)
      return
    }

    // check if peaking fast, if we are peaking fast do not sell
    if (peaking(data, symbol, dataPointIndex, config.peakingPercentage)) {
      // console.log('she is peaking')
      // JSON.stringify(console.log(dataPoint.data), null, 2)
      return
    }

    // filter out the symbol that is gaining in value
    const filteredSymbols = symbols.filter((s) => s !== symbol)

    // go through all the other coins
    filteredSymbols.forEach((symbolToBuy) => {
      const percentageOfSymbolToBuy = dataPoint.data[symbolToBuy].percentChange

      // if this coins percentage change is higher than the one
      // we want to buy then obv do not buy it
      if (percentageOfSymbolToBuy > percentage) {
        // console.log('> than percentage')
        // JSON.stringify(console.log(dataPoint.data), null, 2)
        return
      }

      // if the one we are thinking of buying is tanking. DO NOT BUY IT
      if (
        tanking(data, symbolToBuy, dataPointIndex, config.tankingPercentage)
      ) {
        // console.log('she is tanking')
        // JSON.stringify(console.log(dataPoint.data), null, 2)
        return
      }

      // if the one we are thinking of buying has been going down a while
      // also don't buy it (in our case if in all time we collect data by X%)
      if (sinking(data, symbolToBuy, config.sinkingPercentage)) {
        // console.log('she is sinking')
        // JSON.stringify(console.log(dataPoint.data), null, 2)
        return
      }

      // calculate the amount to buy in usd

      symbolActions.push({
        type: 'buy',
        symbol: symbolToBuy,
        amount: percentage - percentageOfSymbolToBuy,
      })
    })

    // if we have any actions, we know we need to sell our guy, he is doing well
    // lets work out how much we need to sell and buy in binance
    if (symbolActions.length) {
      symbolActions.push({
        type: 'sell',
        symbol,
        amount: 30,
      })
    }
    // we return the array of actions for this symbol, we will check after if
    // there are any other actions that look better than this set. if there are
    // we will favor those instead!
    if (symbolActions.length) {
      actions.push(symbolActions)
    }
  })

  // work out which set of actions to take as there may be more than one
  // we want to do the one with the biggest impact. that will come down to the amount
  // we intend to sell
  if (actions.length) {
    return takeHighestSeller(actions)
  }

  return []
}

export { buyAndSell }
