import { DataSet } from '../types'

// util function to work out if something is peaking
const peaking = (
  data: DataSet,
  symbol: string,
  index: number,
  peakSpeed: number,
  pointsToCheck = 3,
): boolean => {
  // return false if we cannot go that far back
  if (!data[index - pointsToCheck]) {
    return false
  }

  // if the last point is less than the point before it, we are going down again
  // so we are no longer peaking
  if (
    data[index].data[symbol].percentChange <
    data[index - 1].data[symbol].percentChange
  ) {
    return false
  }

  // if going up faster than the ratio
  const lastXDataPoints = [...Array(pointsToCheck)].map((_, pointIndex) => {
    return data[index - pointIndex].data[symbol]
  })

  const diffs = lastXDataPoints.map((point, index) => {
    if (lastXDataPoints[index + 1]) {
      return point.percentChange - lastXDataPoints[index + 1].percentChange
    }
    return 0
  })

  // get the average of the differences
  const averageChange = diffs.reduce((curr, prev) => curr + prev) / diffs.length

  return averageChange > peakSpeed
}

export { peaking }
