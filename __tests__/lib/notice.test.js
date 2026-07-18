import {
  getNoticePages,
  getNoticeTags,
  isNoticePage,
  searchNoticePages
} from '@/lib/notice'

const pages = [
  {
    id: 'world',
    type: 'Page',
    status: 'Invisible',
    category: '공지',
    tags: ['세계관'],
    title: '세계관 안내',
    summary: '배경 설정',
    publishDate: 20
  },
  {
    id: 'review',
    type: 'Page',
    status: 'Published',
    category: '공지',
    tags: ['심사', '이능력'],
    title: '심사 기준',
    summary: '신청서 확인 방법',
    publishDate: 30
  },
  {
    id: 'post',
    type: 'Post',
    status: 'Published',
    category: '공지',
    tags: ['세계관'],
    title: '일반 게시글',
    publishDate: 40
  },
  {
    id: 'draft',
    type: 'Page',
    status: 'Draft',
    category: '공지',
    tags: ['세계관'],
    title: '작성 중',
    publishDate: 50
  }
]

describe('notice helpers', () => {
  it('recognizes only visible Page rows in the notice category', () => {
    expect(isNoticePage(pages[0])).toBe(true)
    expect(isNoticePage(pages[1])).toBe(true)
    expect(isNoticePage(pages[2])).toBe(false)
    expect(isNoticePage(pages[3])).toBe(false)
  })

  it('returns all notices newest first', () => {
    expect(getNoticePages(pages).map(page => page.id)).toEqual([
      'review',
      'world'
    ])
  })

  it('filters notices by an exact tag', () => {
    expect(
      getNoticePages(pages, { tag: '세계관' }).map(page => page.id)
    ).toEqual(['world'])
    expect(
      getNoticePages(pages, { tag: '이능력' }).map(page => page.id)
    ).toEqual(['review'])
  })

  it('collects unique notice tags', () => {
    expect(getNoticeTags(getNoticePages(pages))).toEqual([
      '세계관',
      '심사',
      '이능력'
    ])
  })

  it('searches notice titles, summaries, and tags', () => {
    const notices = getNoticePages(pages)
    expect(searchNoticePages(notices, '기준').map(page => page.id)).toEqual([
      'review'
    ])
    expect(searchNoticePages(notices, '배경').map(page => page.id)).toEqual([
      'world'
    ])
    expect(searchNoticePages(notices, '이능력').map(page => page.id)).toEqual([
      'review'
    ])
  })
})
