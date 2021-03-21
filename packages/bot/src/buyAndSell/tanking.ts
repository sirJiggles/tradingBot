import { DataSet } from '../types'

// util function to work out if something is tanking
const tanking = (
  data: DataSet,
  symbol: string,
  index: number,
  tankSpeed: number,
  pointsToCheck = 3,
): boolean => {
  // return false if we cannot go that far back
  if (!data[index - pointsToCheck]) {
    return false
  }

  // if the last point is > than the point before it, we are going up again
  // so we are no longer tanking
  if (data[index].data[symbol] > data[index - 1].data[symbol]) {
    return false
  }

  // if down faster than the ratio
  const lastXDataPoints = [...Array(pointsToCheck)].map((_, pointIndex) => {
    return data[index - pointIndex].data[symbol]
  })

  const diffs = lastXDataPoints.map((point, index) => {
    if (lastXDataPoints[index + 1]) {
      return point - lastXDataPoints[index + 1]
    }
    return 0
  })

  // get the average of the differences
  const averageChange = diffs.reduce((curr, prev) => curr + prev) / diffs.length

  return averageChange < tankSpeed
}

export { tanking }
