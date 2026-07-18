export const NOTICE_CATEGORY = '공지'

const VISIBLE_LIBRARY_STATUSES = new Set(['Published', 'Invisible'])

const toArray = value => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string' && value.trim()) return [value.trim()]
  return []
}

export const isLibraryPage = (page, category) => {
  if (!page || page.type !== 'Page') return false
  if (!VISIBLE_LIBRARY_STATUSES.has(page.status)) return false
  return toArray(page.category).includes(category)
}

export const getLibraryPages = (allPages, { category, tag } = {}) => {
  const pages = (Array.isArray(allPages) ? allPages : []).filter(page => {
    if (!isLibraryPage(page, category)) return false
    return !tag || toArray(page.tags).includes(tag)
  })

  return pages.sort((a, b) => (b?.publishDate ?? 0) - (a?.publishDate ?? 0))
}

export const getLibraryTags = libraryPages => {
  const tags = new Set()
  ;(Array.isArray(libraryPages) ? libraryPages : []).forEach(page => {
    toArray(page?.tags).forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort((a, b) => a.localeCompare(b, 'ko'))
}

export const searchLibraryPages = (libraryPages, keyword) => {
  const normalizedKeyword = String(keyword || '')
    .trim()
    .toLocaleLowerCase('ko')
  if (!normalizedKeyword) return libraryPages || []

  return (libraryPages || []).filter(page => {
    const content = [page?.title, page?.summary, ...toArray(page?.tags)]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('ko')
    return content.includes(normalizedKeyword)
  })
}

export const isNoticePage = page => isLibraryPage(page, NOTICE_CATEGORY)

export const getNoticePages = (allPages, { tag } = {}) =>
  getLibraryPages(allPages, { category: NOTICE_CATEGORY, tag })

export const getNoticeTags = noticePages => getLibraryTags(noticePages)

export const searchNoticePages = (noticePages, keyword) =>
  searchLibraryPages(noticePages, keyword)
