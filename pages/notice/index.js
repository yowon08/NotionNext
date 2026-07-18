import BLOG from '@/blog.config'
import NoticeLibrary from '@/components/NoticeLibrary'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { getNoticePages, getNoticeTags } from '@/lib/notice'

const NoticeIndex = props => <NoticeLibrary {...props} />

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({
    from: 'notice-index-props',
    locale
  })
  const notices = getNoticePages(props.allPages)

  props.notices = notices
  props.noticeTags = getNoticeTags(notices)
  props.activeTag = ''
  props.post = {
    title: '공지 모아보기',
    summary: '공지 페이지를 한곳에서 검색하고 확인할 수 있습니다.',
    slug: 'notice',
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

export default NoticeIndex
