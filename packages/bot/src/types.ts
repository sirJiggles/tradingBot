// from point a to point b give us a statistic
export type CoinStats = {
  [key: string]: {
    percentChange: number
    valueUSD: number
    value: number
    open: number
  }
}

export type DataEntry = {
  time: string
  // data is the data for all symbols at this point
  // which is why we have a key of type string
  data: CoinStats
}

export type DataSet = Array<DataEntry>

export type Config = {
  threshold: number
  sinkingPercentage: number
  tankingPercentage: number
  peakingPercentage: number
}

export type Action = {
  type: string
  symbol: string
  amount: number
}
