import { DataSet } from '../../types'
import { sinking } from '../'

describe('unit | sinking', () => {
  it('should be sinking if going down over threshold', () => {
    // up to down with a little spike in the middle
    const changes = [9, 8, 7, 6, 5, 4, 5, 6, 5, 4, 7, 6, 5, 4, 3, 2, -1]
    const data: DataSet = changes.map((change, index) => {
      return {
        time: index,
        data: {
          thing: change,
        },
      }
    })
    expect(sinking(data, 'thing', 4)).toEqual(true)
  })
  it('should not be sinking if going down under threshold', () => {
    // up to down with a little spike in the middle
    const changes = [9, 8, 7, 6, 5, 4, 5, 6, 5, 4, 7, 6, 5, 4, 3, 2, -1]
    const data: DataSet = changes.map((change, index) => {
      return {
        time: index,
        data: {
          thing: change,
        },
      }
    })
    expect(sinking(data, 'thing', 10)).toEqual(false)
  })
  it('should not be sinking if going up', () => {
    // up to down with a little spike in the middle
    const changes = [9, 8, 7, 8, 7, 6, 7, 8, 6, 5, 6, 7, 8, 9, 10]
    const data: DataSet = changes.map((change, index) => {
      return {
        time: index,
        data: {
          thing: change,
        },
      }
    })
    expect(sinking(data, 'thing', 2)).toEqual(false)
  })
})
