import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from '../StatusBadge'

describe('StatusBadge', () => {
  it('renders label for known status', () => {
    render(<StatusBadge status="DRAFT" />)
    expect(screen.getByText('Draft')).toBeInTheDocument()
  })

  it('renders correct label for PELANGGARAN_DICATAT', () => {
    render(<StatusBadge status="PELANGGARAN_DICATAT" />)
    expect(screen.getByText('Pelanggaran Dicatat')).toBeInTheDocument()
  })

  it('renders correct label for SELESAI', () => {
    render(<StatusBadge status="SELESAI" />)
    expect(screen.getByText('Selesai')).toBeInTheDocument()
  })

  it('falls back to raw status for unknown status', () => {
    render(<StatusBadge status="UNKNOWN_STATUS" />)
    expect(screen.getByText('UNKNOWN_STATUS')).toBeInTheDocument()
  })

  it('has correct color class for SELESAI', () => {
    render(<StatusBadge status="SELESAI" />)
    const badge = screen.getByText('Selesai')
    expect(badge.className).toContain('bg-green-100')
  })

  it('has correct color class for DRAFT', () => {
    render(<StatusBadge status="DRAFT" />)
    const badge = screen.getByText('Draft')
    expect(badge.className).toContain('bg-gray-100')
  })
})
