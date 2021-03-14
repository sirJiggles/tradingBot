export type CoinStats = {
  [key: string]: number
}

export type DataSet = Array<{ time: number; data: CoinStats }>

export type Config = {
  threshold: number
  sinkingPercentage: number
  tankingPercentage: number
  peakingPercentage: number
}
