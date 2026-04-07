// src/app/robots.ts
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/'],
    },
    sitemap: [
      `${baseUrl}/products-sitemap.xml`,
      `${baseUrl}/pages-sitemap.xml`,
    ],
  }
}