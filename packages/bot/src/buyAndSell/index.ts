import { DataSet, Config, Action } from '../types'
import { peaking } from './peaking'
import { sinking } from './sinking'
import { tanking } from './tanking'
import { takeHighestSeller } from './takeHighestSeller'

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

const buyAndSell = (data: DataSet, symbols: Array<string>): Array<Action> => {
  // the data point we are going to look at, the last one
  const dataPointIndex = data.length - 1
  const dataPoint = data[dataPointIndex]

  // go through all the coins we are working with
  const actions: Array<Array<Action>> = []

  symbols.forEach((symbol) => {
    // what is the percentage of the coin we are looking at?
    const percentage = dataPoint.data[symbol]
    const symbolActions: Array<Action> = []

    // is it above the threshold?
    if (percentage < config.threshold) {
      return
    }

    // check if peaking fast, if we are peaking fast do not sell
    if (peaking(data, symbol, dataPointIndex, config.peakingPercentage)) {
      return
    }

    // filter out the symbol that is gaining in value
    const filteredSymbols = symbols.filter((s) => s !== symbol)

    // go through all the other coins
    filteredSymbols.forEach((symbolToBuy) => {
      const percentageOfSymbolToBuy = dataPoint.data[symbolToBuy]

      // if this coins percentage change is higher than the one
      // we want to buy then obv do not buy it
      if (percentageOfSymbolToBuy > percentage) {
        return
      }

      // if the one we are thinking of buying is tanking. DO NOT BUY IT
      if (
        tanking(data, symbolToBuy, dataPointIndex, config.tankingPercentage)
      ) {
        return
      }

      // if the one we are thinking of buying has been going down a while
      // also don't buy it (in our case if in all time we collect data by X%)
      if (sinking(data, symbolToBuy, config.sinkingPercentage)) {
        return
      }

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
    actions.push(symbolActions)
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
