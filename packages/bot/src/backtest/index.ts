import { formatData } from './formatData'
import { importOldData } from './importOldData'
import { buyAndSell } from '../buyAndSell'
import * as fs from 'fs'
import { Action, Config } from '../types'

const backtest = async (symbols: Array<string>, config: Config) => {
  const historicalData = await importOldData(symbols)
  // first we format the old data into the dataset format so we can run the
  // tests on it
  const dataSet = formatData(symbols, historicalData)

  // white the data out to file so we can look at the numbers later
  fs.writeFileSync(
    `${__dirname}/formatted-data.json`,
    JSON.stringify(dataSet, null, 2),
  )

  const collectionOfActions: Array<Array<Action>> = []
  // now we have all the data in the format we want it let's do some tests
  for (let i = dataSet.length; i > 0; i--) {
    const actions = buyAndSell(dataSet, symbols, config, i)
    // if we have some actions for this data point lets add it to the list of things
    // to simulate
    if (actions.length > 0) {
      collectionOfActions.push(actions)
    }
  }

  // write the backtest actions to file
  fs.writeFileSync(
    `${__dirname}/backtest-actions.json`,
    JSON.stringify(collectionOfActions, null, 2),
  )

  console.log(collectionOfActions)
}

export { backtest }
