import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingState from '../LoadingState'

describe('LoadingState', () => {
  it('renders default message', () => {
    render(<LoadingState />)
    expect(screen.getByText('Memuat data...')).toBeInTheDocument()
  })

  it('renders custom message', () => {
    render(<LoadingState message="Memuat siswa..." />)
    expect(screen.getByText('Memuat siswa...')).toBeInTheDocument()
  })

  it('renders spinner element', () => {
    const { container } = render(<LoadingState />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <LoadingState className="my-8" />
    )
    expect(container.firstChild).toHaveClass('my-8')
  })
})
