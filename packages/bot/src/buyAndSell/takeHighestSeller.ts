import { Action } from '../types'

const takeHighestSeller = (actions: Array<Array<Action>>): Array<Action> => {
  // only return one set of actions by checking which ones will do the most selling
  return actions.reduce((prevActions, currActions) => {
    // if this is the first one, just move along
    if (!prevActions) {
      return currActions
    }
    const curSellAction = currActions.filter((a) => a.type === 'sell')[0]
    const prevSellAction = prevActions.filter((a) => a.type === 'sell')[0]

    return curSellAction.amount > prevSellAction.amount
      ? currActions
      : prevActions
  })
}

export { takeHighestSeller }
