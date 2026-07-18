import BLOG from '@/blog.config'
import NoticeLibrary from '@/components/NoticeLibrary'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { getNoticePages, getNoticeTags } from '@/lib/notice'

const NoticeTag = props => <NoticeLibrary {...props} />

export async function getStaticProps({ params: { tag }, locale }) {
  const props = await fetchGlobalAllData({
    from: 'notice-tag-props',
    locale
  })
  const allNotices = getNoticePages(props.allPages)

  props.notices = getNoticePages(allNotices, { tag })
  props.noticeTags = getNoticeTags(allNotices)
  props.activeTag = tag
  props.post = {
    title: `${tag} 관련 공지`,
    summary: `${tag} 태그가 붙은 공지 페이지 모음입니다.`,
    slug: `notice/tag/${encodeURIComponent(tag)}`,
    tags: [tag],
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

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export default NoticeTag
