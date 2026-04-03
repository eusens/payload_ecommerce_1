// src/app/(app)/shop/page.tsx
// export const dynamic = 'force-dynamic'
import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const metadata = {
  description: 'Search for products in the store.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const { q: searchValue, sort, category } = await searchParams
  const payload = await getPayload({ config: configPromise })

  // 构建 where 条件 - 只搜索 title，不搜索 description
  const whereConditions = []
  
  // 基础条件
  whereConditions.push({
    _status: { equals: 'published' },
  })
  
  // 搜索条件 - 只搜索 title
  if (searchValue && typeof searchValue === 'string') {
    whereConditions.push({
      title: { like: searchValue },
    })
  }
  
  // 分类条件
  if (category && category !== 'all' && typeof category === 'string') {
    whereConditions.push({
      categories: { contains: category },
    })
  }

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInUSD: true,
    },
    sort: sort && typeof sort === 'string' ? sort : 'title',
    where: whereConditions.length === 1 
      ? whereConditions[0] 
      : { and: whereConditions },
  })

  const resultsText = products.docs.length > 1 ? 'results' : 'result'

  return (
    <div>
      {searchValue ? (
        <p className="mb-4">
          {products.docs?.length === 0
            ? 'There are no products that match '
            : `Showing ${products.docs.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {!searchValue && products.docs?.length === 0 && (
        <p className="mb-4">No products found. Please try different filters.</p>
      )}

      {products?.docs.length > 0 ? (
        <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.docs.map((product) => {
            return <ProductGridItem key={product.id} product={product} />
          })}
        </Grid>
      ) : null}
    </div>
  )
}