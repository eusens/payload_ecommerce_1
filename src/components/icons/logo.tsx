// src/components/icons/logo.tsx
import Link from 'next/link'
import React from 'react'

export function LogoIcon({ className }: { className?: string }) {
  return (
    <Link href="/" className="flex items-center">
      <img
        src="/images/logo2.png"
        alt="Eusens Automation"
        width={120}
        height={40}
        className={`dark:brightness-0 dark:invert ${className || ''}`}
      />
    </Link>
  )
}