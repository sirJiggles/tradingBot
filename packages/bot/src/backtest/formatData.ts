import { DataEntry, DataSet } from '../types'
import { HistoricalData } from './types'

const formatData = (
  symbols: Array<string>,
  historicalData: { [key: string]: Array<HistoricalData> },
) => {
  // now we need to convert the historical data into a format that matches our
  // data sets we expect
  const amountOfData = historicalData[symbols[0]].length
  const convertedData: DataSet = []
  for (let i = 0; i < amountOfData; i++) {
    const entry: DataEntry = {
      time: historicalData[symbols[0]][i].unix,
      data: {},
    }
    symbols.forEach((symbol) => {
      // if we have the first entry there is nothing to compare with
      // so the change is 0 percent
      if (i === 0) {
        entry.data[symbol] = 0
        return
      }

      const current = parseFloat(historicalData[symbol][i].open)
      const last = parseFloat(historicalData[symbol][i - 1].open)
      const diff = current - last

      // work out the percent change from last to now
      entry.data[symbol] = parseFloat(((diff / last) * 100).toFixed(2))
    })
    convertedData.push(entry)
  }

  return convertedData
}

export { formatData }
