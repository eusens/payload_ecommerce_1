// src/app/(app)/(sitemaps)/products-sitemap.xml/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getProductsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    
    const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://panasonicservomotor.com'

    // 获取所有已发布的产品
    const results = await payload.find({
      collection: 'products',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 100000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    // 生成 XML 内容
    const urls = results.docs
      .filter((product) => Boolean(product?.slug))
      .map((product) => ({
        loc: `${SITE_URL}/products/${product?.slug}`,
        lastmod: product.updatedAt || dateFallback,
      }))

    return urls
  },
  ['products-sitemap'],
  {
    tags: ['products-sitemap'],
    revalidate: 86400,
  },
)

export async function GET() {
  const urls = await getProductsSitemap()
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://panasonicservomotor.com'
  
  // 手动构建 XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400',
    },
  })
}