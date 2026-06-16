import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Search } from 'lucide-react'
import EmptyState from '../EmptyState'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Tidak ada data" />)
    expect(screen.getByText('Tidak ada data')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <EmptyState title="Kosong" description="Belum ada pelanggaran tercatat" />
    )
    expect(screen.getByText('Belum ada pelanggaran tercatat')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="Kosong" />)
    expect(container.querySelector('p')).not.toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<EmptyState icon={Search} title="Cari" />)
    // lucide Search component renders an SVG
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders action element when provided', () => {
    render(
      <EmptyState
        title="Kosong"
        action={<button>Tambah Data</button>}
      />
    )
    expect(screen.getByText('Tambah Data')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <EmptyState title="Test" className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
