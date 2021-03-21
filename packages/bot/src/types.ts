export type CoinStats = {
  [key: string]: number
}

export type DataEntry = {
  time: string
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
