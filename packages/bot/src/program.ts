import * as fs from 'fs'
import { DataEntry, DataSet, Config } from './types'
import { buyAndSell } from './buyAndSell'
import { fakeData } from './utils'

const dataFilePath = `${__dirname}/data.json`

const generateFakeData = (symbols: Array<string>): DataSet => {
  // lets fake some data to test
  const speeds = [4, 3, 0.2]
  const directions = [0.1, -0.1, -0.1]

  const data = fakeData({
    symbols,
    speeds,
    directions,
    amount: 90,
  })

  // write it to file
  fs.writeFileSync(dataFilePath, JSON.stringify(data))

  return data
}

// the config for the backtest, this is what we pass to buy and sell
const config: Config = {
  // percentage shift up or down to think about doing anything
  threshold: 0.02,
  // percentage loss over all data history
  sinkingPercentage: 4,
  // percentage between each pull of the data shift
  peakingPercentage: 0.4,
  // percentage between each pull of the data shift
  tankingPercentage: -0.4,
}

const run = async () => {
  const symbols = ['BTC', 'ETH', 'GSUS']
  // for now we get some fake data, we will get old data + a new entry from the API
  // when we have it connected to binance
  // const data = generateFakeData(symbols)

  // read the data out the file
  const data = JSON.parse(fs.readFileSync(dataFilePath).toString()) as DataSet

  // @TODO this will come from the API
  // const entry: DataEntry = {
  //   time: '2000',
  //   data: {
  //     BTC: 23,
  //     ETH: 33,
  //     GSUS: 1,
  //   },
  // }

  // add the new entry from the API to the data set
  data.push(entry)
  // remove the oldest entry from the dataset
  data.shift()

  const actions = buyAndSell(data, symbols, config)

  // connect to binance
  // connect()
  // get some percentage data
  // const percentages = await getPercentages(['BTC', 'LTC', 'ETH'])

  // 60, 40, 3
}

export { run }
