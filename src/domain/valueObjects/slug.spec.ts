import { Slug } from './slug'

describe('Slug Value Object', () => {
  it('should create a slug with a valid input', () => {
    const input: Slug = Slug.create('Valid Input')
    expect(input.value).toBe('valid-input')
  })
  it('should restore a valid slug', () => {
    const input: Slug = Slug.restore('valid-input')
    expect(input.value).toBe('valid-input')
  })
})

