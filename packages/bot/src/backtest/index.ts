import { formatData } from './formatData'
import { importOldData } from './importOldData'
import { buyAndSell } from '../buyAndSell'
import * as fs from 'fs'
import { Action, Config } from '../types'

// the config for the backtest, this is what we pass to buy and sell
const config: Config = {
  // percentage shift up or down to think about doing anything
  threshold: 0.01,
  // percentage loss over all data history
  sinkingPercentage: 4,
  // percentage between each pull of the data shift
  peakingPercentage: 0.4,
  // percentage between each pull of the data shift
  tankingPercentage: -0.4,
}

const backtest = async (symbols: Array<string>) => {
  const historicalData = await importOldData(symbols)
  // first we format the old data into the dataset format so we can run the
  // tests on it
  const dataSet = formatData(symbols, historicalData)

  // white the data out to file so we can look at the numbers later
  fs.writeFileSync(`${__dirname}/output.json`, JSON.stringify(dataSet, null, 2))

  const collectionOfActions: Array<Array<Action>> = []
  // now we have all the data in the format we want it let's do some tests
  for (let i = dataSet.length; i > 0; i--) {
    const actions = buyAndSell(dataSet, symbols, config, i)
    if (actions.length > 0) {
      collectionOfActions.push(actions)
    }
  }

  console.log(collectionOfActions)
}

export { backtest }
