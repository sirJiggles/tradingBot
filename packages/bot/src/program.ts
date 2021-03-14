import { data } from './fakeData'
// what percentage up or down will trigger a trade?
const threshold = 15

const run = async () => {
  // assume we get old data + a new request at the end
  const symbols = ['BTC', 'ETH']
  const leData = data(symbols)
  const accumulated: { [key: string]: number } = {}

  // @todo maybe in reverse order?
  leData.forEach((dataPoint) => {
    // check each coin to see if it is above or below
    symbols.forEach((symbol) => {
      const percentage = dataPoint.data[symbol]

      if (percentage > threshold) {
        console.log(JSON.stringify(dataPoint, null, 2))

        console.log(`should sell ${symbol} at ${percentage} percent`)
        let buyOrder = ``
        const filteredSymbols = symbols.filter((s) => s !== symbol)
        filteredSymbols.forEach((symbolToBuy) => {
          const percentageOfSymbolToBuy = dataPoint.data[symbolToBuy]

          console.log(
            'the percentage of the thing we want to buy',
            percentageOfSymbolToBuy,
          )
          // if the one we intend to buy is less than the one above the threshold
          // lets work out how much of it to buy up
          if (percentageOfSymbolToBuy < percentage) {
            const buyAmount = percentageOfSymbolToBuy + percentage
            buyOrder += `BUY ${symbolToBuy}: ${buyAmount}% \n`
          }
        })
        console.log(buyOrder)

        process.exit(1)
      }

      accumulated[symbol] += percentage
    })
  })

  // connect to binance
  // connect()
  // get some percentage data
  // const percentages = await getPercentages(['BTC', 'LTC', 'ETH'])

  // 60, 40, 3
}

export { run }
