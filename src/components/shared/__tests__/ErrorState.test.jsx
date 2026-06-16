import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorState from '../ErrorState'

describe('ErrorState', () => {
  it('renders default message', () => {
    render(<ErrorState />)
    expect(screen.getByText('Terjadi kesalahan')).toBeInTheDocument()
  })

  it('renders custom message', () => {
    render(<ErrorState message="Gagal memuat data siswa" />)
    expect(screen.getByText('Gagal memuat data siswa')).toBeInTheDocument()
  })

  it('renders retry button when onRetry provided', () => {
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)
    const retryBtn = screen.getByText('Coba Lagi')
    expect(retryBtn).toBeInTheDocument()
  })

  it('calls onRetry when retry button clicked', () => {
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)
    fireEvent.click(screen.getByText('Coba Lagi'))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('does not render retry button without onRetry', () => {
    render(<ErrorState />)
    expect(screen.queryByText('Coba Lagi')).not.toBeInTheDocument()
  })

  it('renders oops heading', () => {
    render(<ErrorState />)
    expect(screen.getByText('Oops!')).toBeInTheDocument()
  })
})
