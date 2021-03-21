import { fakeData } from '../../utils'
import { buyAndSell } from '../index'
import { Config } from '../../types'

describe('unit | buy and sell', () => {
  // the main config for the buy and sell functionality
  // these values control how it will decide to do things
  const config: Config = {
    // percentage shift up or down to think about doing anything
    threshold: 3,
    // percentage loss over all data history
    sinkingPercentage: 4,
    // percentage between each pull of the data shift
    peakingPercentage: 0.4,
    // percentage between each pull of the data shift
    tankingPercentage: -0.4,
  }

  it('should not sell anything that is not above the threshold', () => {
    const symbols = ['g', 'd']
    const data = fakeData({
      amount: 20,
      directions: [1, -1],
      speeds: [0.1, 0.1],
      symbols,
    })

    const actions = buyAndSell(data, symbols, config)

    expect(actions.length).toEqual(0)
  })

  it('should not sell anything that is is peaking', () => {
    const symbols = ['g', 'd']
    const data = fakeData({
      amount: 20,
      directions: [1, -1],
      speeds: [0.6, 0.1],
      symbols,
    })

    const actions = buyAndSell(data, symbols, config)

    expect(actions.length).toEqual(0)
  })

  it('should not buy anything that is tanking', () => {
    const symbols = ['g', 'd']
    const data = fakeData({
      amount: 20,
      directions: [1, -1],
      speeds: [0.2, 0.6],
      symbols,
    })

    const actions = buyAndSell(data, symbols, config)

    const buyActions = actions.filter((a) => a.type === 'buy')
    expect(buyActions.length).toEqual(0)
  })

  it('should not buy anything that is sinking', () => {
    const symbols = ['g', 'd']
    const data = fakeData({
      amount: 20,
      directions: [1, -1],
      speeds: [0.2, 0.4],
      symbols,
    })

    const actions = buyAndSell(data, symbols, config)

    const buyActions = actions.filter((a) => a.type === 'buy')
    expect(buyActions.length).toEqual(0)
  })

  it('should not try buy the coin that we are also selling', () => {
    const symbols = ['g', 'd']
    const data = fakeData({
      amount: 20,
      // the one we want to sell is going to hold
      directions: [1, 0],
      speeds: [0.2, 0.2],
      symbols,
    })

    const actions = buyAndSell(data, symbols, config)

    const buyActions = actions.filter((a) => a.type === 'buy')
    expect(buyActions.length).toEqual(1)
    const sellActions = actions.filter((a) => a.type === 'sell')
    expect(sellActions.length).toEqual(1)
    // should be selling g and buying d
    expect(sellActions[0].symbol).toEqual('g')
    expect(buyActions[0].symbol).toEqual('d')
  })

  it('should sell and buy with the action that has the highest selling amount', () => {
    const symbols = ['g', 'd', 'f']
    const data = fakeData({
      amount: 20,
      // the one we want to sell is going to hold
      directions: [1, 1, -1],
      speeds: [0.1, 0.2, 0.1],
      symbols,
    })

    const actions = buyAndSell(data, symbols, config)

    const buyActions = actions.filter((a) => a.type === 'buy')
    expect(buyActions.length).toEqual(2)
    expect(buyActions[0].symbol).toEqual('g')
    expect(buyActions[1].symbol).toEqual('f')

    const sellActions = actions.filter((a) => a.type === 'sell')
    expect(sellActions[0].symbol).toEqual('d')
  })
  // it('should buy at a ratio that is reflective of how high it is', () => {})
})
