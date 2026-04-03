// src/components/Header/index.client.tsx
'use client'
import { CMSLink } from '@/components/Link'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { MobileMenu } from './MobileMenu'
import type { Header } from 'src/payload-types'

import { LogoIcon } from '@/components/icons/logo'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'
import { Search } from '@/components/Search'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

type Props = {
  header: Header
}

// 固定导航菜单
const FIXED_MENU = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/shop' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()

  return (
    <div className="relative z-20 border-b">
      <nav className="flex items-center justify-between container pt-2">
        
        {/* 移动端菜单按钮 */}
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>

        {/* 桌面端布局 */}
        <div className="hidden md:flex w-full items-center justify-between">
          
          {/* 左侧：Logo + 导航 */}
          <div className="flex items-center gap-6">
            <LogoIcon className="w-6 h-auto" />
            <ul className="flex gap-4 text-sm">
              {FIXED_MENU.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn('relative navLink', {
                      active: pathname === item.href,
                    })}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 中间：搜索栏 */}
          <div className="flex-1 max-w-md mx-4">
            <Suspense fallback={<div className="h-10 w-full animate-pulse bg-gray-200 rounded" />}>
              <Search className="w-full" />
            </Suspense>
          </div>

          {/* 右侧：语言切换 + 购物车 */}
          <div className="flex items-center gap-4">
            <Suspense fallback={<div className="w-12 h-8" />}>
              <LanguageSwitcher />
            </Suspense>
            <Suspense fallback={<OpenCartButton />}>
              <Cart />
            </Suspense>
          </div>
        </div>

        {/* 移动端布局 */}
        <div className="flex md:hidden items-center gap-4">
          <Suspense fallback={<div className="w-12 h-8" />}>
            <LanguageSwitcher />
          </Suspense>
          <Suspense fallback={<OpenCartButton />}>
            <Cart />
          </Suspense>
        </div>

      </nav>
    </div>
  )
}