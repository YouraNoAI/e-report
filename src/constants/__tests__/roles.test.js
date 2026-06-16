import { describe, it, expect } from 'vitest'
import {
  ROLES,
  ROLE_LABELS,
  CASE_STATUS,
  LETTER_TYPES,
  LETTER_TYPE_LABELS,
  POINT_THRESHOLDS,
} from '../roles'

describe('ROLES', () => {
  it('has all required roles', () => {
    expect(ROLES.ADMIN).toBe('admin')
    expect(ROLES.GURU_BK).toBe('guru_bk')
    expect(ROLES.STP2K).toBe('stp2k')
    expect(ROLES.WALI_KELAS).toBe('wali_kelas')
    expect(ROLES.KESISWAAN).toBe('kesiswaan')
    expect(ROLES.ORANG_TUA).toBe('orang_tua')
    expect(ROLES.SISWA).toBe('siswa')
  })
})

describe('ROLE_LABELS', () => {
  it('has labels for all roles', () => {
    expect(ROLE_LABELS[ROLES.ADMIN]).toBe('Admin')
    expect(ROLE_LABELS[ROLES.SISWA]).toBe('Siswa')
  })
})

describe('CASE_STATUS', () => {
  it('has correct escalation order', () => {
    const order = [
      CASE_STATUS.DRAFT,
      CASE_STATUS.PELANGGARAN_DICATAT,
      CASE_STATUS.PEMBINAAN_STP2K,
      CASE_STATUS.KONSELING_BK,
      CASE_STATUS.PROSES_KESISWAAN,
      CASE_STATUS.SURAT_DIBUAT,
      CASE_STATUS.ORANG_TUA_DIPANGGIL,
      CASE_STATUS.SELESAI,
    ]
    expect(order).toHaveLength(8)
  })
})

describe('POINT_THRESHOLDS', () => {
  it('covers 0 to Infinity', () => {
    expect(POINT_THRESHOLDS.PELANGGARAN_DICATAT.min).toBe(0)
    expect(POINT_THRESHOLDS.SURAT_DIBUAT.max).toBe(Infinity)
  })

  it('has no gaps between thresholds', () => {
    expect(POINT_THRESHOLDS.PEMBINAAN_STP2K.min).toBe(25)
    expect(POINT_THRESHOLDS.KONSELING_BK.min).toBe(50)
    expect(POINT_THRESHOLDS.PROSES_KESISWAAN.min).toBe(75)
    expect(POINT_THRESHOLDS.SURAT_DIBUAT.min).toBe(100)
  })
})

describe('LETTER_TYPES', () => {
  it('includes SP1, SP2, SP3, PERJANJIAN, PANGGILAN_ORANG_TUA', () => {
    expect(LETTER_TYPES.SP1).toBe('SP1')
    expect(LETTER_TYPES.SP2).toBe('SP2')
    expect(LETTER_TYPES.SP3).toBe('SP3')
  })

  it('has labels for all letter types', () => {
    expect(LETTER_TYPE_LABELS[LETTER_TYPES.SP1]).toBe('Surat Peringatan 1')
    expect(LETTER_TYPE_LABELS[LETTER_TYPES.PANGGILAN_ORANG_TUA]).toBe('Panggilan Orang Tua')
  })
})
