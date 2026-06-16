import { describe, it, expect } from 'vitest'
import { violationSchema } from '../violationSchema'

describe('violationSchema', () => {
  it('accepts valid violation data', () => {
    const result = violationSchema.safeParse({
      studentId: 'student-1',
      categoryId: 'cat-1',
      description: 'Terlambat masuk sekolah tanpa keterangan',
      violationDate: new Date('2026-06-15'),
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing studentId', () => {
    const result = violationSchema.safeParse({
      categoryId: 'cat-1',
      description: 'Terlambat masuk sekolah tanpa keterangan',
      violationDate: new Date(),
    })
    expect(result.success).toBe(false)
  })

  it('rejects description shorter than 10 characters', () => {
    const result = violationSchema.safeParse({
      studentId: 'student-1',
      categoryId: 'cat-1',
      description: 'Terlambat',
      violationDate: new Date(),
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing violationDate', () => {
    const result = violationSchema.safeParse({
      studentId: 'student-1',
      categoryId: 'cat-1',
      description: 'Terlambat masuk sekolah tanpa keterangan',
    })
    expect(result.success).toBe(false)
  })

  it('accepts optional evidence field', () => {
    const result = violationSchema.safeParse({
      studentId: 'student-1',
      categoryId: 'cat-1',
      description: 'Terlambat masuk sekolah tanpa keterangan',
      violationDate: new Date(),
      evidence: 'https://example.com/bukti.jpg',
    })
    expect(result.success).toBe(true)
  })
})
