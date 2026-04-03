// src/components/LanguageSwitcher.tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
]

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentLocale = searchParams.get('locale') || 'en'
  
  const switchLanguage = (locale: string) => {
    // 创建新的 URLSearchParams
    const params = new URLSearchParams(searchParams.toString())
    params.set('locale', locale)
    router.push(`${pathname}?${params.toString()}`)
  }
  
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-sm px-2 py-1 rounded-md hover:bg-muted transition">
        <span>{languages.find(l => l.code === currentLocale)?.flag}</span>
        <span>{currentLocale.toUpperCase()}</span>
      </button>
      <div className="absolute right-0 mt-1 hidden group-hover:block bg-popover border rounded-md shadow-lg z-50 min-w-[100px]">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition ${
              currentLocale === lang.code ? 'text-primary font-medium' : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}