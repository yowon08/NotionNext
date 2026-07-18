import NoticeLibrary from '@/components/NoticeLibrary'
import { fireEvent, render, screen } from '@testing-library/react'

jest.mock('@/components/LazyImage', () => ({
  __esModule: true,
  default: ({ alt = '', ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  )
}))

const storyPages = [
  {
    id: 'story-1',
    title: '첫 번째 이야기',
    summary: '주인공의 모험이 시작됩니다.',
    href: '/story-first',
    tags: ['메인스토리'],
    pageCoverThumbnail: 'https://example.com/story-cover.jpg'
  },
  {
    id: 'story-2',
    title: '외전',
    summary: '조연의 짧은 이야기입니다.',
    href: '/story-side',
    tags: ['외전']
  }
]

const storyLibrary = {
  basePath: '/story',
  title: '스토리',
  itemLabel: '스토리',
  icon: '📚',
  showCover: true
}

describe('NoticeLibrary', () => {
  it('shows web-novel covers when the library cover option is enabled', () => {
    render(<NoticeLibrary libraryPages={storyPages} library={storyLibrary} />)

    expect(screen.getByAltText('첫 번째 이야기 표지')).toBeInTheDocument()
    expect(screen.getByText('📖')).toBeInTheDocument()
  })

  it('hides covers when the library cover option is disabled', () => {
    render(
      <NoticeLibrary
        libraryPages={storyPages}
        library={{ ...storyLibrary, showCover: false }}
      />
    )

    expect(screen.queryByAltText('첫 번째 이야기 표지')).not.toBeInTheDocument()
    expect(screen.getByText('첫 번째 이야기')).toBeInTheDocument()
  })

  it('searches only within the current library pages', () => {
    render(<NoticeLibrary libraryPages={storyPages} library={storyLibrary} />)

    fireEvent.change(screen.getByRole('searchbox', { name: '스토리 검색' }), {
      target: { value: '외전' }
    })

    expect(screen.getByText('외전')).toBeInTheDocument()
    expect(screen.queryByText('첫 번째 이야기')).not.toBeInTheDocument()
  })
})
