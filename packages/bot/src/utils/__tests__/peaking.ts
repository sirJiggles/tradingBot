import { peaking } from '../'
import { DataSet } from '../../types'

describe('check if something is peaking', () => {
  it('should return true if the value is going up fast', () => {
    const changes = [0.3, 1.3, 2, 4]
    const data: DataSet = changes.map((change, index) => {
      return {
        time: index,
        data: {
          thing: change,
        },
      }
    })
    expect(peaking(data, 'thing', 3, 0.4)).toEqual(true)
  })

  it('should return false if the increase is gradual', () => {
    const changes = [0.3, 0.5, 0.8, 1]
    const data: DataSet = changes.map((change, index) => {
      return {
        time: index,
        data: {
          thing: change,
        },
      }
    })
    expect(peaking(data, 'thing', 3, 0.4)).toEqual(false)
  })

  it('should return false if the last item in the list is lower than the one before it', () => {
    const changes = [1, 4, 10, 4]
    const data: DataSet = changes.map((change, index) => {
      return {
        time: index,
        data: {
          thing: change,
        },
      }
    })
    expect(peaking(data, 'thing', 3, 0.4)).toEqual(false)
  })
})
