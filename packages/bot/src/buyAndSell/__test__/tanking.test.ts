import { tanking } from '../tanking'
import { DataSet } from '../../types'

describe('check if something is peaking', () => {
  it('should return true if the value is going down fast', () => {
    const changes = [5, 3, 2, 1]
    const data: DataSet = changes.map((change, index) => {
      return {
        time: index,
        data: {
          thing: change,
        },
      }
    })
    expect(tanking(data, 'thing', 3, -0.4)).toEqual(true)
  })

  it('should return false if the decrease is gradual', () => {
    const changes = [1, 0.8, 0.6, 0.3]
    const data: DataSet = changes.map((change, index) => {
      return {
        time: index,
        data: {
          thing: change,
        },
      }
    })
    expect(tanking(data, 'thing', 3, -0.4)).toEqual(false)
  })

  it('should return false if the last item in the list is higher than the one before it', () => {
    const changes = [5, 4, 3, 4]
    const data: DataSet = changes.map((change, index) => {
      return {
        time: index,
        data: {
          thing: change,
        },
      }
    })
    expect(tanking(data, 'thing', 3, -0.4)).toEqual(false)
  })
})
