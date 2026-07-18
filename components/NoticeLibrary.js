import NotionIcon from '@/components/NotionIcon'
import SmartLink from '@/components/SmartLink'
import { searchNoticePages } from '@/lib/notice'
import { useEffect, useMemo, useState } from 'react'

const getPageHref = page => page?.href || `/${page?.slug || page?.id}`

const NoticeLibrary = ({ notices = [], noticeTags = [], activeTag = '' }) => {
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    setKeyword('')
  }, [activeTag])

  const filteredNotices = useMemo(
    () => searchNoticePages(notices, keyword),
    [keyword, notices]
  )

  const title = activeTag ? `${activeTag} 관련 공지` : '공지 모아보기'

  return (
    <section className='w-full md:pr-8 mb-12 px-1 md:px-5'>
      <header className='mb-8 border-b border-[var(--claude-border,#e5e5e0)] pb-6'>
        <div className='flex items-center gap-3 mb-2'>
          <span className='text-2xl' aria-hidden='true'>
            📢
          </span>
          <h1 className='text-2xl font-semibold text-[var(--claude-text-primary,#1a1a1a)]'>
            {title}
          </h1>
        </div>
        <p className='text-sm text-[var(--claude-text-secondary,#5c5c5c)]'>
          {activeTag
            ? `‘${activeTag}’ 태그가 붙은 공지만 모아서 보여줍니다.`
            : '공지 페이지를 한곳에서 검색하고 확인할 수 있습니다.'}
        </p>
      </header>

      <div className='relative mb-5'>
        <i
          className='fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--claude-text-tertiary,#8c8c8c)]'
          aria-hidden='true'
        />
        <input
          type='search'
          value={keyword}
          onChange={event => setKeyword(event.target.value)}
          placeholder={
            activeTag
              ? `${activeTag} 공지에서 검색`
              : '공지 제목, 설명, 태그 검색'
          }
          aria-label='공지 검색'
          className='w-full rounded-lg border border-[var(--claude-border,#e5e5e0)] bg-[var(--claude-bg,#fff)] py-3 pl-11 pr-4 text-sm text-[var(--claude-text-primary,#1a1a1a)] outline-none transition-colors placeholder:text-[var(--claude-text-tertiary,#8c8c8c)] focus:border-[var(--claude-accent,#da7756)]'
        />
      </div>

      <nav className='mb-7 flex flex-wrap gap-2' aria-label='공지 태그'>
        <SmartLink
          href='/notice'
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
            !activeTag
              ? 'border-[var(--claude-accent,#da7756)] bg-[var(--claude-accent,#da7756)] text-white'
              : 'border-[var(--claude-border,#e5e5e0)] text-[var(--claude-text-secondary,#5c5c5c)] hover:border-[var(--claude-accent,#da7756)]'
          }`}
        >
          전체
        </SmartLink>
        {noticeTags.map(tag => (
          <SmartLink
            key={tag}
            href={`/notice/tag/${encodeURIComponent(tag)}`}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              activeTag === tag
                ? 'border-[var(--claude-accent,#da7756)] bg-[var(--claude-accent,#da7756)] text-white'
                : 'border-[var(--claude-border,#e5e5e0)] text-[var(--claude-text-secondary,#5c5c5c)] hover:border-[var(--claude-accent,#da7756)]'
            }`}
          >
            #{tag}
          </SmartLink>
        ))}
      </nav>

      <div className='mb-3 flex items-center justify-between text-xs text-[var(--claude-text-tertiary,#8c8c8c)]'>
        <span>{filteredNotices.length}개의 공지</span>
        {keyword && <span>검색어: {keyword}</span>}
      </div>

      <div className='divide-y divide-[var(--claude-border,#e5e5e0)] border-y border-[var(--claude-border,#e5e5e0)]'>
        {filteredNotices.map(page => (
          <article key={page.id} className='py-5'>
            <div className='flex items-start gap-3'>
              <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--claude-bg-secondary,#f3f3ee)]'>
                {page.pageIcon ? (
                  <NotionIcon icon={page.pageIcon} />
                ) : (
                  <span aria-hidden='true'>📄</span>
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <SmartLink
                  href={getPageHref(page)}
                  className='text-base font-medium text-[var(--claude-text-primary,#1a1a1a)] transition-colors hover:text-[var(--claude-accent,#da7756)]'
                >
                  {page.title}
                </SmartLink>
                {page.summary && (
                  <p className='mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--claude-text-secondary,#5c5c5c)]'>
                    {page.summary}
                  </p>
                )}
                <div className='mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--claude-text-tertiary,#8c8c8c)]'>
                  {page.publishDay && <span>{page.publishDay}</span>}
                  {page.tags?.map(tag => (
                    <SmartLink
                      key={tag}
                      href={`/notice/tag/${encodeURIComponent(tag)}`}
                      className='transition-colors hover:text-[var(--claude-accent,#da7756)]'
                    >
                      #{tag}
                    </SmartLink>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredNotices.length === 0 && (
        <div className='py-16 text-center text-sm text-[var(--claude-text-tertiary,#8c8c8c)]'>
          {keyword
            ? '검색어와 일치하는 공지가 없습니다.'
            : '이 분류에 등록된 공지가 아직 없습니다.'}
        </div>
      )}
    </section>
  )
}

export default NoticeLibrary
