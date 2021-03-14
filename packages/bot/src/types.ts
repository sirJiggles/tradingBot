export type CoinStats = {
  [key: string]: number
}

export type DataSet = Array<{ time: number; data: CoinStats }>
