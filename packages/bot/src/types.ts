export type CoinStats = {
  [key: string]: number
}

export type DataEntry = {
  time: number
  data: CoinStats
  actedUpon?: boolean
}

export type DataSet = Array<DataEntry>

export type Config = {
  threshold: number
  sinkingPercentage: number
  tankingPercentage: number
  peakingPercentage: number
}
