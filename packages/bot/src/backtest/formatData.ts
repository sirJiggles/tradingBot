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
        entry.data[symbol] = {
          percentChange: 0,
          open: 0,
          valueUSD: 0,
          value: 0,
        }
        return
      }

      const currentPoint = historicalData[symbol][i]
      const lastPoint = historicalData[symbol][i - 1]

      const current = parseFloat(currentPoint.open)
      const last = parseFloat(lastPoint.open)
      const diff = current - last

      // store all the data for the entry point
      entry.data[symbol] = {
        open: parseFloat(currentPoint.open),
        percentChange: parseFloat(((diff / last) * 100).toFixed(2)),
        value: parseFloat(currentPoint.volume),
        valueUSD: parseFloat(currentPoint.volumeUSD),
      }
    })
    convertedData.push(entry)
  }

  return convertedData
}

export { formatData }
