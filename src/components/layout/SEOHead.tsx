import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  type?: 'website' | 'article'
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export const SEOHead = ({
  title = 'EthioLearn - Digital Skills Academy',
  description = 'Transform your future with digital skills. Join thousands of Ethiopians mastering technology through our comprehensive digital academy.',
  keywords = 'ethiopia, digital skills, programming, technology, education, online learning, coding bootcamp, web development, mobile development',
  image = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
  type = 'website',
  author = 'EthioLearn Academy',
  publishedTime,
  modifiedTime
}: SEOHeadProps) => {
  const location = useLocation()
  const currentUrl = `${window.location.origin}${location.pathname}`

  useEffect(() => {
    // Update document title
    document.title = title

    // Update meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement
      
      if (!meta) {
        meta = document.createElement('meta')
        if (property) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }

    // Basic meta tags
    updateMeta('description', description)
    updateMeta('keywords', keywords)
    updateMeta('author', author)

    // Open Graph tags
    updateMeta('og:title', title, true)
    updateMeta('og:description', description, true)
    updateMeta('og:image', image, true)
    updateMeta('og:url', currentUrl, true)
    updateMeta('og:type', type, true)
    updateMeta('og:site_name', 'EthioLearn', true)

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image')
    updateMeta('twitter:title', title)
    updateMeta('twitter:description', description)
    updateMeta('twitter:image', image)

    // Article specific tags
    if (type === 'article') {
      if (publishedTime) updateMeta('article:published_time', publishedTime, true)
      if (modifiedTime) updateMeta('article:modified_time', modifiedTime, true)
      updateMeta('article:author', author, true)
    }

    // Structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": type === 'article' ? 'Article' : 'WebSite',
      "name": title,
      "description": description,
      "url": currentUrl,
      "image": image,
      "author": {
        "@type": "Organization",
        "name": author
      },
      ...(type === 'website' && {
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${window.location.origin}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      })
    }

    let jsonLd = document.querySelector('#structured-data') as HTMLScriptElement
    if (!jsonLd) {
      jsonLd = document.createElement('script')
      jsonLd.id = 'structured-data'
      jsonLd.type = 'application/ld+json'
      document.head.appendChild(jsonLd)
    }
    jsonLd.textContent = JSON.stringify(structuredData)

  }, [title, description, keywords, image, type, author, publishedTime, modifiedTime, currentUrl])

  return null
}