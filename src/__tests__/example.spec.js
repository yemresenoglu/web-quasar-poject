/**
 * Example Test
 * 
 * This is a simple test to verify that Vitest is working correctly.
 * You can delete this file once you start writing real tests.
 */

import { describe, it, expect } from 'vitest'

describe('Vitest Setup', () => {
  it('should run a simple test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have access to Vitest globals', () => {
    expect(describe).toBeDefined()
    expect(it).toBeDefined()
    expect(expect).toBeDefined()
  })

  it('should support ES6 features', () => {
    const arr = [1, 2, 3]
    const doubled = arr.map(x => x * 2)
    expect(doubled).toEqual([2, 4, 6])
  })

  it('should support async/await', async () => {
    const promise = Promise.resolve(42)
    const result = await promise
    expect(result).toBe(42)
  })
})

