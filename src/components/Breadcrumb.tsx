import Link from 'next/link'
import type { Product } from '@/payload-types'

interface BreadcrumbProps {
  product: Product
}

export function ProductBreadcrumb({ product }: BreadcrumbProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.2000-watt-inverter.com'
  
  // 获取第一个分类的名称（如果存在）
  let categoryName: string | null = null
  let categorySlug: string | null = null
  
  if (product.categories && product.categories.length > 0) {
    const firstCategory = product.categories[0]
    // 检查 firstCategory 是对象还是 ID
    if (typeof firstCategory === 'object' && firstCategory !== null) {
      categoryName = firstCategory.title
      categorySlug = firstCategory.slug
    }
  }

  return (
    <>
      {/* 面包屑 UI */}
      <nav className="mb-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-700 hover:underline">
              Home
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          {categoryName ? (
            <>
              <li>
                <Link
                  href={`/categories/${categorySlug}`}
                  className="hover:text-gray-700 hover:underline"
                >
                  {categoryName}
                </Link>
              </li>
              <li className="text-gray-400">/</li>
            </>
          ) : (
            <>
              <li>
                <Link href="/shop" className="hover:text-gray-700 hover:underline">
                  Products
                </Link>
              </li>
              <li className="text-gray-400">/</li>
            </>
          )}
          <li className="text-gray-700 font-medium truncate max-w-[200px]">
            {product.title}
          </li>
        </ol>
      </nav>

      {/* 面包屑 Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": categoryName || "Products",
                "item": categoryName 
                  ? `${siteUrl}/categories/${categorySlug}`
                  : `${siteUrl}/shop`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": product.title,
                "item": `${siteUrl}/products/${product.slug}`
              }
            ]
          })
        }}
      />
    </>
  )
}