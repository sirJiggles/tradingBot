import { formatData } from '../formatData'
import { HistoricalData } from '../types'

describe('unit | backtest | formatData', () => {
  // some mock data so we can test our format data function is working
  const oldData: { [key: string]: Array<HistoricalData> } = {
    coinOne: [
      {
        close: '21.0',
        date: '12323',
        high: '123',
        low: '345',
        symbol: 'coinOne',
        tradecount: '123',
        unix: '3434',
        open: '20.0',
        volume: '1',
        volumeUSD: '1',
      },
      {
        close: '21.0',
        date: '12323',
        high: '123',
        low: '345',
        symbol: 'coinOne',
        tradecount: '123',
        unix: '3434',
        open: '21.0',
        volume: '1',
        volumeUSD: '1',
      },
      {
        close: '21.0',
        date: '12323',
        high: '123',
        low: '345',
        symbol: 'coinOne',
        tradecount: '123',
        unix: '3434',
        open: '25.0',
        volume: '1',
        volumeUSD: '1',
      },
    ],
    coinTwo: [
      {
        close: '21.0',
        date: '12323',
        high: '123',
        low: '345',
        symbol: 'coinTwo',
        tradecount: '123',
        unix: '3434',
        open: '10',
        volume: '1',
        volumeUSD: '1',
      },
      {
        close: '21.0',
        date: '12323',
        high: '123',
        low: '345',
        symbol: 'coinTwo',
        tradecount: '123',
        unix: '3434',
        open: '9',
        volume: '1',
        volumeUSD: '1',
      },
      {
        close: '21.0',
        date: '12323',
        high: '123',
        low: '345',
        symbol: 'coinTwo',
        tradecount: '123',
        unix: '3434',
        open: '8',
        volume: '1',
        volumeUSD: '1',
      },
    ],
  }
  it('should format the data correctly', () => {
    const data = formatData(['coinOne', 'coinTwo'], oldData)

    // check the changes in percent from coin one along the formatted history
    expect(data[0].data['coinOne'].percentChange).toEqual(0.0)
    expect(data[1].data['coinOne'].percentChange).toEqual(5.0)
    expect(data[2].data['coinOne'].percentChange).toEqual(19.05)

    // check the changes in percent in coin two along the formatted history
    expect(data[0].data['coinTwo'].percentChange).toEqual(0.0)
    expect(data[1].data['coinTwo'].percentChange).toEqual(-10.0)
    expect(data[2].data['coinTwo'].percentChange).toEqual(-11.11)
  })
})
