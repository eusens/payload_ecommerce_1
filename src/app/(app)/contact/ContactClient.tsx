// src/app/(app)/contact/ContactClient.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  Phone, Mail, MapPin, MessageCircle, MessageSquare,
  Truck, ShoppingCart, ShoppingBag, Headphones, LaptopMinimalCheck
} from 'lucide-react'

export default function ContactClient() {
  // 表单相关状态
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const [product, setProduct] = useState('')
  const honeypotRef = useRef<HTMLInputElement>(null)

  // 服务承诺数据
  const features = [
    { icon: Truck, title: "Fast SHIPPING", subtitle: "From All around the world" },
    { icon: ShoppingCart, title: "Order Online", subtitle: "From anywhere" },
    { icon: Headphones, title: "24/7 SUPPORT", subtitle: "Unlimited Support" },
    { icon: LaptopMinimalCheck, title: "100% SAFE", subtitle: "View our benefits" },
    { icon: ShoppingBag, title: "FREE RETURNS", subtitle: "Track or off orders" },
  ]

  // 从 URL 参数获取产品名
  useEffect(() => {
    const productParam = searchParams.get('product')
    if (productParam) {
      setProduct(productParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (searchParams.get('product')) {
      window.scrollTo({ top: 400, behavior: 'smooth' })
    }
  }, [searchParams])

  // 表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 蜜罐检测
    if (honeypotRef.current && honeypotRef.current.value !== '') {
      console.log('Bot detected, rejecting silently')
      setStatus('Message sent successfully!')
      e.currentTarget.reset()
      return
    }

    setLoading(true)
    setStatus('Sending...')

    const formData = new FormData(e.currentTarget)
    formData.delete('website')

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
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
      {/* ========== 页面标题 ========== */}
      <h1 className="text-4xl font-bold text-center mb-4">Contact Us</h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
        We are here to answer any questions you may have about our products and services.
        Reach out to us and we&apos;ll respond as soon as we can.
      </p>

      {/* ========== 联系方式卡片 ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-10">
        {/* 电话 */}
        <div className="bg-gray-100 p-6 rounded-lg text-center shadow hover:shadow-md transition">
          <Phone className="w-8 h-8 mx-auto mb-3 text-blue-600" />
          <h2 className="font-semibold text-lg mb-2">Call Us</h2>
          <p className="text-gray-700">+86 137 6081 2861</p>
          <p className="text-gray-500 text-sm">Mon - Fri, 9am - 6pm</p>
        </div>

        {/* 邮箱 */}
        <div className="bg-gray-100 p-6 rounded-lg text-center shadow hover:shadow-md transition">
          <Mail className="w-8 h-8 mx-auto mb-3 text-blue-600" />
          <h2 className="font-semibold text-lg mb-2">Email Us</h2>
          <p className="text-gray-700 break-all">sales@newsinoenergy.com</p>
        </div>

        {/* 地址 */}
        <div className="bg-gray-100 p-6 rounded-lg text-center shadow hover:shadow-md transition">
          <MapPin className="w-8 h-8 mx-auto mb-3 text-blue-600" />
          <h2 className="font-semibold text-lg mb-2">Address</h2>
          <p className="text-gray-700">2304, building 4, 93# XingHai Rd</p>
          <p className="text-gray-700">Guangzhou, China</p>
        </div>

        {/* WhatsApp */}
        <div className="bg-gray-100 p-6 rounded-lg text-center shadow hover:shadow-md transition">
          <MessageCircle className="w-8 h-8 mx-auto mb-3 text-green-600" />
          <h2 className="font-semibold text-lg mb-2">WhatsApp</h2>
          <a
            href="https://wa.me/8613760812861"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 font-medium hover:underline"
          >
            Chat on WhatsApp
          </a>
          <p className="text-gray-500 text-sm mt-2">+86 137 6081 2861</p>
        </div>

        {/* 微信 */}
        <div className="bg-gray-100 p-6 rounded-lg text-center shadow hover:shadow-md transition">
          <MessageSquare className="w-8 h-8 mx-auto mb-3 text-green-600" />
          <h2 className="font-semibold text-lg mb-2">WeChat</h2>
          <Image
            src="https://sanityimages.s3.us-west-2.amazonaws.com/IMG_9423.jpeg"
            alt="WeChat QR Code"
            width={120}
            height={120}
            className="mx-auto rounded-lg"
            unoptimized
          />
          <p className="text-gray-500 text-sm mt-2">Scan to add</p>
        </div>
      </div>

      {/* ========== 地图 ========== */}
      <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-md mb-12">
        <Image
          src="/images/locationmap.png"
          alt="Company location map"
          fill
          className="object-cover"
        />
      </div>

      {/* ========== 询价表单 ========== */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Request a Quote</h2>
          <p className="text-gray-600">Get response within 24 hours</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="fullName"
            placeholder="Full Name *"
            required
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email *"
            required
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="company"
            placeholder="Company"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Product / Model *"
            required
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="quantity"
            placeholder="Quantity (e.g. 2 units)"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="country"
            placeholder="Country (e.g. UAE, USA, Germany)"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="message"
            placeholder="Project Details / Requirements *"
            required
            rows={5}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 蜜罐字段 */}
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-6 py-3 rounded w-full transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Request Quote'}
          </button>
        </form>

        {status && (
          <p className={`mt-4 text-center ${status.includes('Sent') || status.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </p>
        )}
      </div>

      {/* ========== 服务承诺 ========== */}
      <div className="bg-gray-100 py-10 rounded-lg mt-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {features.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <item.icon className="w-12 h-12 mb-3 text-blue-600" />
              <h3 className="font-bold text-sm md:text-base">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}