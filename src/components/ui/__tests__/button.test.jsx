import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Klik Saya</Button>)
    const button = screen.getByRole('button', { name: /klik saya/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
  })

  it('renders as child when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByRole('link', { name: /link button/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('bg-primary')
  })

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="destructive">Hapus</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-danger')

    rerender(<Button variant="outline">Batal</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-border')
  })

  it('applies size classes', () => {
    render(<Button size="sm">Kecil</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-8')
  })

  it('forwards additional className', () => {
    render(<Button className="mt-4">Custom</Button>)
    expect(screen.getByRole('button')).toHaveClass('mt-4')
  })

  it('forwards ref', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Ref Test</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('renders with icon only size', () => {
    render(<Button size="icon" aria-label="Search"><span>🔍</span></Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9', 'w-9')
  })
})
