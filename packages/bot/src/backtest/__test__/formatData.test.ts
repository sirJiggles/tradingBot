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
      },
    ],
  }
  it('should format the data correctly', () => {
    const data = formatData(['coinOne', 'coinTwo'], oldData)

    // check the changes in percent from coin one along the formatted history
    expect(data[0].data['coinOne']).toEqual(0.0)
    expect(data[1].data['coinOne']).toEqual(5.0)
    expect(data[2].data['coinOne']).toEqual(19.05)

    // check the changes in percent in coin two along the formatted history
    expect(data[0].data['coinTwo']).toEqual(0.0)
    expect(data[1].data['coinTwo']).toEqual(-10.0)
    expect(data[2].data['coinTwo']).toEqual(-11.11)
  })
})
