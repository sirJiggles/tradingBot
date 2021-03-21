import { HistoricalData } from './types'
import csv from 'csv-parser'
import * as fs from 'fs'

const importOldData = (symbols: Array<string>) => {
  const historicalData: { [key: string]: Array<HistoricalData> } = {}
  // get the csv's containing old data for the coins passed
  symbols.forEach((symbol) => {
    historicalData[symbol] = []
    fs.createReadStream(`${__dirname}/../old-data/${symbol}.csv`)
      .pipe(csv())
      .on('data', (dataPoint: HistoricalData) =>
        historicalData[symbol].push(dataPoint),
      )
  })

  return historicalData
}

export { importOldData }
