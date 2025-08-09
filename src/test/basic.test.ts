import { describe, it, expect } from 'vitest'

describe('Application Tests', () => {
  it('should run basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should test string manipulation', () => {
    const testString = 'EthioLearn'
    expect(testString.toLowerCase()).toBe('ethiolearn')
  })

  it('should test array operations', () => {
    const numbers = [1, 2, 3, 4, 5]
    expect(numbers.length).toBe(5)
    expect(numbers.includes(3)).toBe(true)
  })
})