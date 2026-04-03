// src/app/(app)/contact/page.tsx
import { Suspense } from 'react'
import ContactClient from './ContactClient'

export const dynamic = 'force-dynamic'

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto py-16 px-4">Loading...</div>}>
      <ContactClient />
    </Suspense>
  )
}