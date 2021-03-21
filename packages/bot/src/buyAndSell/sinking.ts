import { DataSet } from '../types'

// work out if we have been going down for the entire time
// and over a certain threshold
const sinking = (
  data: DataSet,
  symbol: string,
  sinkThreshold: number,
): boolean => {
  // if the first point is lower than the latest point past the threshold she is sinking
  const first = data[0].data[symbol].percentChange
  const last = data[data.length - 1].data[symbol].percentChange
  const diff = first - last
  // if it is going down by a diff greater than the threshold
  return last < first && diff > sinkThreshold
}

export { sinking }
