import { fireEvent, render, screen } from '@testing-library/react'
import NotionLink, {
  getClientSideHref,
  shouldOpenNotionLinkInNewTab
} from '@/components/NotionLink'

const mockPush = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush })
}))

describe('NotionLink', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('uses client-side navigation for internal links', () => {
    render(<NotionLink href='/article/notice'>Notice</NotionLink>)

    fireEvent.click(screen.getByRole('link', { name: 'Notice' }))

    expect(mockPush).toHaveBeenCalledWith('/article/notice')
  })

  it('uses client-side navigation for same-origin absolute links', () => {
    render(
      <NotionLink href={`${window.location.origin}/article/rules?from=notice`}>
        Rules
      </NotionLink>
    )

    fireEvent.click(screen.getByRole('link', { name: 'Rules' }))

    expect(mockPush).toHaveBeenCalledWith('/article/rules?from=notice')
  })

  it('preserves native browser behavior for modified clicks', () => {
    render(<NotionLink href='/article/notice'>Notice</NotionLink>)

    fireEvent.click(screen.getByRole('link', { name: 'Notice' }), {
      ctrlKey: true
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('opens external http links in a new tab', () => {
    render(<NotionLink href='https://example.com'>Example</NotionLink>)

    const link = screen.getByRole('link', { name: 'Example' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('keeps same-origin absolute links in current tab', () => {
    expect(
      shouldOpenNotionLinkInNewTab(
        'https://blog.example.com/article/abc',
        undefined,
        'https://blog.example.com'
      )
    ).toBe(false)
  })

  it('preserves existing rel tokens when forcing a new tab', () => {
    render(
      <NotionLink href='https://example.com' rel='nofollow sponsored'>
        Example
      </NotionLink>
    )

    const link = screen.getByRole('link', { name: 'Example' })
    expect(link).toHaveAttribute('rel', expect.stringContaining('nofollow'))
    expect(link).toHaveAttribute('rel', expect.stringContaining('sponsored'))
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
  })

  it('keeps mailto links in current tab by default', () => {
    render(<NotionLink href='mailto:test@example.com'>Mail</NotionLink>)

    const link = screen.getByRole('link', { name: 'Mail' })
    expect(link).toHaveAttribute('href', 'mailto:test@example.com')
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('rel')
  })

  it('keeps explicit blank targets and adds safe rel tokens', () => {
    render(
      <NotionLink href='mailto:test@example.com' target='_blank'>
        Mail
      </NotionLink>
    )

    const link = screen.getByRole('link', { name: 'Mail' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('getClientSideHref', () => {
  it('returns routes for relative and same-origin links', () => {
    expect(
      getClientSideHref('/article/notice', 'https://blog.example.com')
    ).toBe('/article/notice')
    expect(
      getClientSideHref(
        'https://blog.example.com/article/notice#rules',
        'https://blog.example.com'
      )
    ).toBe('/article/notice#rules')
  })

  it('ignores external, hash-only, and non-http links', () => {
    expect(
      getClientSideHref(
        'https://external.example.com/article/notice',
        'https://blog.example.com'
      )
    ).toBeNull()
    expect(getClientSideHref('#rules', 'https://blog.example.com')).toBeNull()
    expect(
      getClientSideHref(
        '//external.example.com/notice',
        'https://blog.example.com'
      )
    ).toBeNull()
    expect(
      getClientSideHref('mailto:test@example.com', 'https://blog.example.com')
    ).toBeNull()
  })
})

describe('shouldOpenNotionLinkInNewTab', () => {
  it('returns true for explicit blank targets and cross-origin http links', () => {
    expect(
      shouldOpenNotionLinkInNewTab('mailto:test@example.com', '_blank')
    ).toBe(true)
    expect(
      shouldOpenNotionLinkInNewTab(
        'https://external.example.com',
        undefined,
        'https://blog.example.com'
      )
    ).toBe(true)
    expect(
      shouldOpenNotionLinkInNewTab(
        'http://external.example.com',
        undefined,
        'https://blog.example.com'
      )
    ).toBe(true)
  })

  it('returns false for non-http links and same-origin http links', () => {
    expect(shouldOpenNotionLinkInNewTab('/posts/demo')).toBe(false)
    expect(shouldOpenNotionLinkInNewTab('#section-1')).toBe(false)
    expect(shouldOpenNotionLinkInNewTab('mailto:test@example.com')).toBe(false)
    expect(
      shouldOpenNotionLinkInNewTab(
        'https://blog.example.com/abc',
        undefined,
        'https://blog.example.com'
      )
    ).toBe(false)
  })
})
