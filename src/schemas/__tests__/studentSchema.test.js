import { describe, it, expect } from 'vitest'
import { studentSchema } from '../studentSchema'

describe('studentSchema', () => {
  it('accepts valid student data', () => {
    const result = studentSchema.safeParse({
      nis: '12345',
      fullName: 'Ahmad Fauzi',
      className: 'XII-TKJ-1',
      major: 'TKJ',
      gender: 'L',
    })
    expect(result.success).toBe(true)
  })

  it('rejects short NIS', () => {
    const result = studentSchema.safeParse({
      nis: '12',
      fullName: 'Ahmad Fauzi',
      className: 'XII-TKJ-1',
      major: 'TKJ',
      gender: 'L',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid gender', () => {
    const result = studentSchema.safeParse({
      nis: '12345',
      fullName: 'Ahmad Fauzi',
      className: 'XII-TKJ-1',
      major: 'TKJ',
      gender: 'X',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid gender L and P', () => {
    const male = studentSchema.safeParse({
      nis: '12345', fullName: 'Ahmad', className: 'XII-TKJ-1', major: 'TKJ', gender: 'L',
    })
    const female = studentSchema.safeParse({
      nis: '12346', fullName: 'Siti', className: 'XII-TKJ-1', major: 'TKJ', gender: 'P',
    })
    expect(male.success).toBe(true)
    expect(female.success).toBe(true)
  })

  it('accepts optional parent fields', () => {
    const result = studentSchema.safeParse({
      nis: '12345',
      fullName: 'Ahmad Fauzi',
      className: 'XII-TKJ-1',
      major: 'TKJ',
      gender: 'L',
      parentName: 'Budi',
      parentPhone: '08123456789',
      parentEmail: 'budi@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid parent email', () => {
    const result = studentSchema.safeParse({
      nis: '12345',
      fullName: 'Ahmad Fauzi',
      className: 'XII-TKJ-1',
      major: 'TKJ',
      gender: 'L',
      parentEmail: 'bukan-email',
    })
    expect(result.success).toBe(false)
  })
})
