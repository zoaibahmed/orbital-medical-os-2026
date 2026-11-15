import{describe,it,expect}from'vitest'
import{initialGraphicsQuality}from'../scene/quality/config'
describe('public high-fidelity policy',()=>{
 it('ignores lower-tier public and development query requests in production',()=>{
  expect(initialGraphicsQuality(new URLSearchParams('quality=low&devQuality=low'),false)).toBe('standard')
  expect(initialGraphicsQuality(new URLSearchParams(),false)).toBe('standard')
 })
 it('allows only explicit internal diagnostic requests during development',()=>{
  expect(initialGraphicsQuality(new URLSearchParams('quality=low'),true)).toBe('standard')
  expect(initialGraphicsQuality(new URLSearchParams('devQuality=low'),true)).toBe('low')
 })
})
