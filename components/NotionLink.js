import { useRouter } from 'next/router'

const EXTERNAL_HTTP_LINK = /^https?:\/\//i

const mergeRelValues = (...values) => {
  const rel = new Set()

  values
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean)
    .forEach(token => rel.add(token))

  return rel.size > 0 ? Array.from(rel).join(' ') : undefined
}

const isExternalHttpLink = (href, siteOrigin) => {
  if (typeof href !== 'string' || !EXTERNAL_HTTP_LINK.test(href)) {
    return false
  }

  if (!siteOrigin) {
    return true
  }

  try {
    const hrefUrl = new URL(href)
    return hrefUrl.origin !== siteOrigin
  } catch {
    return true
  }
}

export const getClientSideHref = (href, siteOrigin) => {
  if (typeof href !== 'string' || !href || href.startsWith('#')) {
    return null
  }

  if (href.startsWith('/') && !href.startsWith('//')) {
    return href
  }

  if (!EXTERNAL_HTTP_LINK.test(href) || !siteOrigin) {
    return null
  }

  try {
    const url = new URL(href)
    if (url.origin !== siteOrigin) {
      return null
    }
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return null
  }
}

export const shouldOpenNotionLinkInNewTab = (href, target, siteOrigin) => {
  if (target === '_blank') {
    return true
  }

  const fallbackOrigin =
    siteOrigin ||
    (typeof window !== 'undefined' && window.location
      ? window.location.origin
      : null)

  return isExternalHttpLink(href, fallbackOrigin)
}

const NotionLink = ({ href, target, rel, ...props }) => {
  const router = useRouter()
  const shouldOpenInNewTab = shouldOpenNotionLinkInNewTab(href, target)
  const normalizedTarget = shouldOpenInNewTab ? '_blank' : target
  const normalizedRel = shouldOpenInNewTab
    ? mergeRelValues(rel, 'noopener noreferrer')
    : rel

  const handleClick = event => {
    props.onClick?.(event)

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      normalizedTarget === '_blank' ||
      props.download
    ) {
      return
    }

    const siteOrigin = window.location?.origin
    const clientSideHref = getClientSideHref(href, siteOrigin)
    if (!clientSideHref) {
      return
    }

    event.preventDefault()
    router.push(clientSideHref)
  }

  return (
    <a
      {...props}
      href={href}
      target={normalizedTarget}
      rel={normalizedRel}
      onClick={handleClick}
    />
  )
}

export default NotionLink
