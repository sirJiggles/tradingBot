// import { run } from './src/program'

// run()

import { backtest } from './src/backtest'
import { Config } from './src/types'

// the config for the backtest, this is what we pass to buy and sell
const config: Config = {
  // percentage shift up or down to think about doing anything
  threshold: 1,
  // percentage loss over all data history
  sinkingPercentage: 4,
  // percentage between each pull of the data shift
  peakingPercentage: 0.5,
  // percentage between each pull of the data shift
  tankingPercentage: -0.5,
}

backtest(['BTC', 'ETH'], config)
