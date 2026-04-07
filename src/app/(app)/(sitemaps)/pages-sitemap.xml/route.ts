// src/app/(app)/(sitemaps)/pages-sitemap.xml/route.ts
import { unstable_cache } from 'next/cache'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://panasonicservomotor.com'

// 定义所有静态页面
const STATIC_PAGES = [
  {
    slug: '',
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    slug: 'about',
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    slug: 'contact',
    changefreq: 'monthly',
    priority: 0.5,
  },
  // 添加其他静态页面
  // {
  //   slug: 'services',
  //   changefreq: 'weekly',
  //   priority: 0.6,
  // },
  // {
  //   slug: 'faq',
  //   changefreq: 'monthly',
  //   priority: 0.4,
  // },
]

const getPagesSitemap = unstable_cache(
  async () => {
    const now = new Date().toISOString()
    
    return STATIC_PAGES.map((page) => ({
      loc: `${SITE_URL}/${page.slug}`,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority,
    }))
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
    revalidate: 86400, // 24小时
  },
)

export async function GET() {
  const urls = await getPagesSitemap()
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400',
    },
  })
}