import { Action } from '../../types'
import { takeHighestSeller } from '../takeHighestSeller'

describe('unit | take highest seller actions', () => {
  it('should pick an action that sells the highest', () => {
    const actions: Array<Array<Action>> = [
      [{ type: 'sell', amount: 1, symbol: 'EUR' }],
      [{ type: 'sell', amount: 3, symbol: 'EUR' }],
      [{ type: 'sell', amount: 2, symbol: 'EUR' }],
    ]

    expect(takeHighestSeller(actions)[0].amount).toEqual(3)
  })
})
