import { formatData } from './formatData'
import { importOldData } from './importOldData'
import { buyAndSell } from '../buyAndSell'
import * as fs from 'fs'
import { Action } from '../types'

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
    console.log('instance')
    collectionOfActions.push(buyAndSell(dataSet, symbols, i))
  }

  console.log(collectionOfActions)
}

export { backtest }