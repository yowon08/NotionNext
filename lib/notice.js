export const NOTICE_CATEGORY = '공지'

const VISIBLE_NOTICE_STATUSES = new Set(['Published', 'Invisible'])

const toArray = value => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string' && value.trim()) return [value.trim()]
  return []
}

export const isNoticePage = (page, category = NOTICE_CATEGORY) => {
  if (!page || page.type !== 'Page') return false
  if (!VISIBLE_NOTICE_STATUSES.has(page.status)) return false
  return toArray(page.category).includes(category)
}

export const getNoticePages = (
  allPages,
  { category = NOTICE_CATEGORY, tag } = {}
) => {
  const notices = (Array.isArray(allPages) ? allPages : []).filter(page => {
    if (!isNoticePage(page, category)) return false
    return !tag || toArray(page.tags).includes(tag)
  })

  return notices.sort((a, b) => (b?.publishDate ?? 0) - (a?.publishDate ?? 0))
}

export const getNoticeTags = noticePages => {
  const tags = new Set()
  ;(Array.isArray(noticePages) ? noticePages : []).forEach(page => {
    toArray(page?.tags).forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort((a, b) => a.localeCompare(b, 'ko'))
}

export const searchNoticePages = (noticePages, keyword) => {
  const normalizedKeyword = String(keyword || '')
    .trim()
    .toLocaleLowerCase('ko')
  if (!normalizedKeyword) return noticePages || []

  return (noticePages || []).filter(page => {
    const content = [page?.title, page?.summary, ...toArray(page?.tags)]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('ko')
    return content.includes(normalizedKeyword)
  })
}
