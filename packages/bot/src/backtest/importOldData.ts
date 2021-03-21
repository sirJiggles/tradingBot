import { HistoricalData } from './types'
import csv from 'async-csv'
import * as fs from 'fs'

const convertRowsToHistoricalEntry = (
  rows: Array<string>,
): Array<HistoricalData> => {
  const data = rows.map((row) => {
    //unix,date,symbol,open,high,low,close,Volume BTC,Volume USDT,tradecount
    return {
      unix: row[0],
      date: row[1],
      symbol: row[2],
      open: row[3],
      high: row[4],
      low: row[5],
      close: row[6],
      volume: row[7],
      volumeUSD: row[8],
      tradecount: row[9],
    } as HistoricalData
  })

  return data
}

const importOldData = async (symbols: Array<string>) => {
  const historicalData: { [key: string]: Array<HistoricalData> } = {}
  // get the csv's containing old data for the coins passed
  for (const symbol of symbols) {
    historicalData[symbol] = []
    const csvString = fs
      .readFileSync(`${__dirname}/../old-data/${symbol}.csv`)
      .toString()
    const rows = (await csv.parse(csvString)) as Array<string>
    historicalData[symbol] = convertRowsToHistoricalEntry(rows)
  }

  return historicalData
}

export { importOldData }
