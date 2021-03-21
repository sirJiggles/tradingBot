import { formatData } from './formatData'
import { importOldData } from './importOldData'

const backtest = (symbols: Array<string>) => {
  const historicalData = importOldData(symbols)
  // first we format the old data into the dataset format so we can run the
  // tests on it
  const dataSet = formatData(symbols, historicalData)

  // now we have all the data in the format we want it let's do some tests
}

export { backtest }
