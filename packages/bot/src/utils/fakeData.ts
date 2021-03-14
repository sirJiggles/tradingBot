import { CoinStats } from '../types'

// the config for the kind of data you would like to create
// speeds are the speed they change
// directions are the speeds they change in that direction
// symbols are the ones you would like to name and test
type dataConfig = {
  symbols: Array<string>
  speeds: Array<number>
  directions: Array<number>
  amount: number
}

// a bunch of numbers that shift by a speed in a direction
const numbers = (config: dataConfig): Array<Array<number>> => {
  const { symbols, speeds, directions, amount } = config
  return [...Array(amount)].map((_, index) => {
    return symbols.map((_, symbolIndex) => {
      return index * speeds[symbolIndex] * directions[symbolIndex]
    })
  })
}

const fakeData = (
  config: dataConfig,
): Array<{ time: number; data: CoinStats }> => {
  return numbers(config).map((number, index) => {
    const itemData: CoinStats = {}
    config.symbols.map((symbol, symbolIndex) => {
      itemData[symbol] = parseFloat(number[symbolIndex].toFixed(2))
    })
    return {
      time: index,
      data: itemData,
    }
  })
}

export { fakeData }
