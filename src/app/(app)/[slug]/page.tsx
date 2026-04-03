// src/app/(app)/[slug]/page.tsx
import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { homeStaticData } from '@/endpoints/seed/home-static'
import React from 'react'

import type { Page } from '@/payload-types'
import { notFound } from 'next/navigation'

// 支持的语言类型（与 payload.config.ts 保持一致）
const SUPPORTED_LOCALES = ['en', 'zh', 'fr', 'de', 'es', 'ja', 'ko'] as const
type Locale = typeof SUPPORTED_LOCALES[number]

// 获取有效的 locale，无效则返回默认 'en'
function getValidLocale(locale?: string): Locale {
  if (locale && SUPPORTED_LOCALES.includes(locale as Locale)) {
    return locale as Locale
  }
  return 'en'
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => doc.slug !== 'home')
    .map(({ slug }) => ({ slug }))

  return params || []
}

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<{
    locale?: string
  }>
}

export default async function Page({ params, searchParams }: Args) {
  const { slug = 'home' } = await params
  const { locale: rawLocale } = await searchParams
  const locale = getValidLocale(rawLocale)

  let page = await queryPageBySlug({
    slug,
    locale,
  })

  // 如果首页没有找到，使用静态数据
  if (!page && slug === 'home') {
    page = homeStaticData() as Page
  }

  if (!page) {
    return notFound()
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  const { slug = 'home' } = await params
  const { locale: rawLocale } = await searchParams
  const locale = getValidLocale(rawLocale)

  const page = await queryPageBySlug({
    slug,
    locale,
  })

  return generateMeta({ doc: page })
}

// 查询页面（支持多语言）
const queryPageBySlug = async ({
  slug,
  locale,
}: {
  slug: string
  locale: Locale
}) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return result.docs?.[0] || null
}