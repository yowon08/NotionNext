import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { getLibraryPages, getLibraryTags } from '@/lib/notice'

export const PAGE_LIBRARIES = {
  notice: {
    key: 'notice',
    basePath: '/notice',
    category: '공지',
    title: '공지',
    itemLabel: '공지',
    icon: '📢',
    coverConfigKey: 'NOTICE_LIBRARY_COVER_ENABLE',
    defaultShowCover: false
  },
  story: {
    key: 'story',
    basePath: '/story',
    category: '스토리',
    title: '스토리',
    itemLabel: '스토리',
    icon: '📚',
    coverConfigKey: 'STORY_LIBRARY_COVER_ENABLE',
    defaultShowCover: true
  }
}

export async function buildLibraryStaticProps(
  { locale, tag = '' },
  libraryKey
) {
  const libraryConfig = PAGE_LIBRARIES[libraryKey]
  if (!libraryConfig) return { notFound: true }

  const props = await fetchGlobalAllData({
    from: `${libraryKey}-library-props`,
    locale
  })
  const allLibraryPages = getLibraryPages(props.allPages, {
    category: libraryConfig.category
  })

  props.libraryPages = tag
    ? getLibraryPages(allLibraryPages, {
        category: libraryConfig.category,
        tag
      })
    : allLibraryPages
  props.libraryTags = getLibraryTags(allLibraryPages)
  props.activeTag = tag
  props.library = {
    ...libraryConfig,
    showCover: siteConfig(
      libraryConfig.coverConfigKey,
      libraryConfig.defaultShowCover,
      props.NOTION_CONFIG
    )
  }
  props.post = {
    title: tag
      ? `${tag} 관련 ${libraryConfig.title}`
      : `${libraryConfig.title} 모아보기`,
    summary: tag
      ? `${tag} 태그가 붙은 ${libraryConfig.itemLabel} 페이지 모음입니다.`
      : `${libraryConfig.itemLabel} 페이지를 한곳에서 검색하고 확인할 수 있습니다.`,
    slug: tag
      ? `${libraryConfig.key}/tag/${encodeURIComponent(tag)}`
      : libraryConfig.key,
    tags: tag ? [tag] : [],
    type: 'Page'
  }
  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}
