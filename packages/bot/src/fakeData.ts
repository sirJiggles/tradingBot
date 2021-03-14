import { CoinStats } from './types'

const shiftSpeeds = [5, 3]
const shiftDirections = [0.1, -0.1]
// assuming we run every two mins and keep 3 hours of data
const amount = 90

// a bunch of numbers that shift by a speed in a direction
const numbers = (): Array<Array<number>> => {
  return [...Array(amount)].map((_, index) => {
    return [
      index * shiftSpeeds[0] * shiftDirections[0],
      index * shiftSpeeds[1] * shiftDirections[1],
    ]
  })
}

const data = (
  symbols: Array<string>,
): Array<{ time: number; data: CoinStats }> => {
  return numbers().map((number, index) => {
    const itemData: CoinStats = {}
    symbols.map((symbol, symbolIndex) => {
      itemData[symbol] = parseFloat(number[symbolIndex].toFixed(2))
    })
    return {
      time: index,
      data: itemData,
    }
  })
}

export { data }
