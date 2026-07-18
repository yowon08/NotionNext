import NoticeLibrary from '@/components/NoticeLibrary'
import { buildLibraryStaticProps } from '@/lib/libraryPageProps'

const StoryTag = props => <NoticeLibrary {...props} />

export function getStaticProps({ params: { tag }, locale }) {
  return buildLibraryStaticProps({ locale, tag }, 'story')
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export default StoryTag
