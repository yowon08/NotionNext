import NoticeLibrary from '@/components/NoticeLibrary'
import { buildLibraryStaticProps } from '@/lib/libraryPageProps'

const StoryIndex = props => <NoticeLibrary {...props} />

export function getStaticProps({ locale }) {
  return buildLibraryStaticProps({ locale }, 'story')
}

export default StoryIndex
