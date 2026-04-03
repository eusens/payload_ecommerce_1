'use client'

import { useState, useEffect } from 'react'              // ✅ 新增 useEffect
import { useSearchParams } from 'next/navigation'        // ✅ 新增

export default function ContactPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ 新增：URL 参数读取
  const searchParams = useSearchParams()

  // ✅ 新增：product state
  const [product, setProduct] = useState('')

  // ✅ 新增：自动填充 product
  useEffect(() => {
    const productParam = searchParams.get('product')
    if (productParam) {
      setProduct(productParam)
    }
  }, [searchParams])

  // ✅ 新增（可选）：自动滚动
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
        product: formData.get('product'),   // ✅ 会自动带上
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

      <p className="mb-8 text-gray-600">
        Get response within 24 hours
      </p>

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

        {/* ⭐ 核心：自动带参数 */}
        <input
          name="product"
          value={product}                                  // ✅ 新增
          onChange={(e) => setProduct(e.target.value)}     // ✅ 新增
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