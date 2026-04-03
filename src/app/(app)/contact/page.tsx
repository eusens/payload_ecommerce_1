// src/app/(app)/contact/page.tsx
export const dynamic = 'force-dynamic'  // ← 必须在最顶部，在 'use client' 之前！

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ContactPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const [product, setProduct] = useState('')

  useEffect(() => {
    const productParam = searchParams.get('product')
    if (productParam) {
      setProduct(productParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (searchParams.get('product')) {
      window.scrollTo({ top: 200, behavior: 'smooth' })
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus('Sending...')

    const formData = new FormData(e.currentTarget)

    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        company: formData.get('company'),
        product: formData.get('product'),
        quantity: formData.get('quantity'),
        country: formData.get('country'),
        message: formData.get('message'),
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()

    setLoading(false)
    setStatus(data.message || (res.ok ? 'Sent!' : 'Failed'))

    if (res.ok) e.currentTarget.reset()
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-2">Request a Quote</h1>
      <p className="mb-8 text-gray-600">Get response within 24 hours</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="fullName"
          placeholder="Full Name *"
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email *"
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          name="company"
          placeholder="Company"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          name="product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Product / Model *"
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          name="quantity"
          placeholder="Quantity (e.g. 2 units)"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          name="country"
          placeholder="Country (e.g. UAE, USA, Germany)"
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="message"
          placeholder="Project Details / Requirements *"
          required
          rows={5}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded w-full"
        >
          {loading ? 'Sending...' : 'Request Quote'}
        </button>
      </form>

      {status && <p className="mt-4">{status}</p>}
    </div>
  )
}