import Link from 'next/link'
import type { Product } from '@/payload-types'

interface BreadcrumbProps {
  product: Product
}

export function ProductBreadcrumb({ product }: BreadcrumbProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.2000-watt-inverter.com'
  
  // 获取第一个分类的信息
  let categoryId: number | null = null
  let categoryName: string | null = null
  
  if (product.categories && product.categories.length > 0) {
    const firstCategory = product.categories[0]
    // 检查 firstCategory 是对象还是 ID
    if (typeof firstCategory === 'object' && firstCategory !== null) {
      categoryId = firstCategory.id
      categoryName = firstCategory.title
    } else if (typeof firstCategory === 'number') {
      // 如果是 ID，可能需要额外查询获取名称，这里先暂用 ID
      categoryId = firstCategory
      categoryName = `Category ${firstCategory}`
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
                  href={`/shop?category=${categoryId}`}
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
          <li className="text-gray-700 font-medium truncate max-w-[200px] md:max-w-[400px]">
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
                  ? `${siteUrl}/shop?category=${categoryId}`
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