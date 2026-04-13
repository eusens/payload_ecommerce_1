// src/app/(app)/shop/page.tsx
import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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

// 辅助函数：安全地获取字符串参数
const getStringParam = (param: string | string[] | undefined): string | undefined => {
  if (typeof param === 'string') return param
  if (Array.isArray(param) && param.length > 0) return param[0]
  return undefined
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams
  
  // 安全地获取各个参数
  const searchValue = getStringParam(params.q)
  const sort = getStringParam(params.sort)
  const category = getStringParam(params.category)
  const pageParam = getStringParam(params.page) || '1'
  
  const currentPage = Math.max(1, parseInt(pageParam, 10) || 1)
  const ITEMS_PER_PAGE = 12
  
  const payload = await getPayload({ config: configPromise })

  // 构建 where 条件
  const whereConditions = []
  
  whereConditions.push({
    _status: { equals: 'published' },
  })
  
  if (searchValue) {
    whereConditions.push({
      title: { like: searchValue },
    })
  }
  
  if (category && category !== 'all') {
    whereConditions.push({
      categories: { contains: category },
    })
  }

  // 查询产品
  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    limit: ITEMS_PER_PAGE,
    page: currentPage,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInUSD: true,
    },
    sort: sort || 'title',
    where: whereConditions.length === 1 
      ? whereConditions[0] 
      : { and: whereConditions },
  })

  const resultsText = products.docs.length > 1 ? 'results' : 'result'

  // 生成页码数组
  const generatePaginationItems = () => {
    const items = []
    const maxVisible = 5
    
    if (products.totalPages <= maxVisible) {
      for (let i = 1; i <= products.totalPages; i++) {
        items.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) items.push(i)
      } else if (currentPage >= products.totalPages - 2) {
        for (let i = products.totalPages - 4; i <= products.totalPages; i++) items.push(i)
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) items.push(i)
      }
    }
    return items
  }

  // 构建带参数的 URL
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams()
    if (searchValue) params.set('q', searchValue)
    if (category && category !== 'all') params.set('category', category)
    if (sort) params.set('sort', sort)
    if (pageNumber > 1) params.set('page', pageNumber.toString())
    const queryString = params.toString()
    return `/shop${queryString ? `?${queryString}` : ''}`
  }

  return (
    <div>
      {searchValue ? (
        <p className="mb-4">
          {products.docs?.length === 0
            ? 'There are no products that match '
            : `Showing ${products.totalDocs} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {!searchValue && products.docs?.length === 0 && (
        <p className="mb-4">No products found. Please try different filters.</p>
      )}

      {products?.docs.length > 0 ? (
        <>
          <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.docs.map((product) => {
              return <ProductGridItem key={product.id} product={product} />
            })}
          </Grid>
          
          {/* 分页组件 */}
          {products.totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  {/* 上一页 */}
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={createPageURL(currentPage - 1)} />
                    </PaginationItem>
                  )}
                  
                  {/* 页码 */}
                  {generatePaginationItems().map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href={createPageURL(pageNum)}
                        isActive={pageNum === currentPage}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {/* 下一页 */}
                  {currentPage < products.totalPages && (
                    <PaginationItem>
                      <PaginationNext href={createPageURL(currentPage + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}