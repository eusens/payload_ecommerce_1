// src/app/(app)/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Eusens Automation - Industrial Automation Solutions',
  description: 'Professional automation distributor based in Vietnam, serving Food & Beverage, Cement, Mining, Oil & Gas, and more.',
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  
  // 获取最新产品（按创建时间倒序）
  const latestProducts = await payload.find({
    collection: 'products',
    limit: 6,
    sort: '-createdAt',
    where: { _status: { equals: 'published' } },
    depth: 2,
  })

  const products = latestProducts.docs

  // 辅助函数：格式化价格（美分转美元）
  const formatPrice = (priceInCents?: number | null) => {
    if (!priceInCents) return 'Contact for price'
    return `$${(priceInCents / 100).toFixed(2)}`
  }

  // 辅助函数：获取产品图片
  const getProductImage = (product: any) => {
    // 优先使用 gallery 的第一张图
    if (product.gallery?.[0]?.image?.url) {
      return product.gallery[0].image.url
    }
    // 其次使用 meta 图片
    if (product.meta?.image?.url) {
      return product.meta.image.url
    }
    return null
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      
      {/* 1. Hero 区域 */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Industrial Automation
          <span className="text-primary block">Solutions</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your trusted partner in industrial automation spare parts and components.
          Serving industries worldwide since 2010.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/shop" className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm hover:bg-primary/90 transition">
            Shop Now
          </Link>
          <Link href="/about" className="border border-primary text-primary px-5 py-2 rounded-md text-sm hover:bg-primary/10 transition">
            Learn More
          </Link>
        </div>
      </section>

      {/* 2. 最新产品网格 - 紧凑卡片 */}
      {products.length >= 3 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-5 text-center">Latest Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.slice(0, 3).map((product) => {
              const imageUrl = getProductImage(product)
              const price = formatPrice(product.priceInUSD)
              
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 bg-card"
                >
                  {/* 图片区域 */}
                  <div className="aspect-square bg-muted/30 overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.title}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  
                  {/* 信息区域 */}
                  <div className="p-3">
                    <h3 className="font-medium text-sm group-hover:text-primary transition line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-primary font-semibold text-sm mt-1">
                      {price}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* 3. 公司介绍 - 两列布局 */}
<section className="mb-12">
  <div className="grid md:grid-cols-2 gap-8">
    
    {/* 左侧：公司简介 */}
<div className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition">
  <div className="flex items-center gap-2 mb-4">
    <div className="w-1 h-6 bg-primary rounded-full"></div>
    <h2 className="text-xl font-bold">About Eusens</h2>
  </div>
  <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
    <p>
      An automation distributor based in China. Eusens is a professional supplier 
      serving various industries including Food & Beverage, Cement, Mining, Oil & Gas, 
      and On-shore/Off-shore Cranes.
    </p>
    <p className="text-green-600 dark:text-green-400 font-medium">
      ✓ The spare parts we sell are guaranteed for one year and are rigorously tested 
      and certified.
    </p>
    <p>
      We are now a global manufacturer of industrial automation spare parts and components.
    </p>
    
    {/* 👇 图片加在这里 */}
    <div className="flex justify-center pt-2">
      <img
        src="/images/company_seal.png"
        alt="Company Seal"
        className="w-48 h-24 object-contain opacity-80 hover:opacity-100 transition"
      />
    </div>
  </div>
</div>
    
    {/* 右侧：产品范围 */}
    <div className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-primary rounded-full"></div>
        <h2 className="text-xl font-bold">Our Main Products</h2>
      </div>
      
      <div className="space-y-4 text-muted-foreground text-sm">
        {/* 核心产品 */}
        <div className="bg-primary/5 rounded-lg p-3">
          <p className="font-semibold text-foreground mb-1">Core Products:</p>
          <p>distributed control system (DCS), programmable logic controller (PLC), large servo control system.</p>
        </div>
        
        {/* 液压元件 */}
        <div>
          <p className="font-semibold text-foreground mb-1">I. Hydraulic Components:</p>
          <p className="leading-relaxed">
            ATOS (Italy), ASCO (USA), PARKER (Pneumatic & Hydraulic), VICKERS, MOOG (USA), 
            FAIRCHILD (USA), HAWE (Germany), BOSCH-REXROTH (Germany), HYDAC (Germany), Danfoss, 
            GSR (Germany), E+H (Germany), NORGREN (UK), YUKEN (Japan), NACHI (Japan), TAIYO (Japan), 
            TOYOOKI (Japan), DAIKIN (Japan), AI-TEK (USA), CROUZET (USA), DENISON (USA).
          </p>
        </div>
        
        {/* 工业控制产品 */}
        <div>
          <p className="font-semibold text-foreground mb-1">II. Industrial Control Products:</p>
          <p className="leading-relaxed">
            German: PILZ relays, IFM sensors, HEIDENHAIN, P+F sensors, MURR, BALLUFF, TURCK, SICK, 
            MARHEL, Phoenix Contact, Hirschmann industrial switches.<br />
            Japanese: Omron, Sunx, KEYENCE, Airtac.<br />
            Others: Taiwan Mindman, USA Metrix, BAUMER, USA MTS.
          </p>
        </div>
        
        {/* 气动元件 */}
        <div>
          <p className="font-semibold text-foreground mb-1">III. Pneumatic Components:</p>
          <p className="leading-relaxed">
            German: FESTO, BURKERT, Helon, AVENTICS, Mahle.<br />
            Japanese: SMC, CKD, KOGRNE, NOK, TACO, KURODA, SUN.<br />
            Korean: YPC, TKC, YSC, TPC.<br />
            Others: Italian UNIVER, Camozzi, AMISCO coils; American ROSS, MAC solenoid valves; 
            French Crouzet, Eltra, CARLO GAVAZZI.
          </p>
        </div>
        
        {/* 公司理念 */}
        <div className="border-t pt-3 mt-2 text-center text-xs text-muted-foreground italic">
          "Quality First, Reputation First, Service First"
        </div>
      </div>
    </div>
    
  </div>
</section>

      {/* 4. 更多产品 - 水平轮播/滚动区域 */}
      {products.length >= 4 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">More Products</h2>
            <Link href="/shop" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {products.slice(3, 7).map((product) => {
              const imageUrl = getProductImage(product)
              const price = formatPrice(product.priceInUSD)
              
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group border rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  <div className="aspect-square bg-muted/30 overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.title}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-xs line-clamp-1">{product.title}</h3>
                    <p className="text-primary font-semibold text-xs mt-0.5">{price}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* 5. 品牌标签 */}
<section className="mb-12">
  <h2 className="text-xl font-bold mb-5 text-center">Trusted Brands</h2>
  <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto">
    {/* 液压元件品牌 */}
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">ATOS</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">ASCO</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">PARKER</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">VICKERS</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">MOOG</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">FAIRCHILD</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">HAWE</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">BOSCH-REXROTH</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">HYDAC</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">Danfoss</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">GSR</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">E+H</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">NORGREN</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">YUKEN</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">NACHI</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">TAIYO</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">TOYOOKI</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">DAIKIN</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">AI-TEK</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">CROUZET</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">DENISON</span>
    
    {/* 工业控制产品品牌 */}
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">PILZ</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">IFM</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">HEIDENHAIN</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">P+F</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">MURR</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">BALLUFF</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">TURCK</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">SICK</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">MARHEL</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">Phoenix Contact</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">Hirschmann</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">Omron</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">Sunx</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">KEYENCE</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">Airtac</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">Mindman</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">Metrix</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">BAUMER</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">MTS</span>
    
    {/* 气动元件品牌 */}
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">FESTO</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">BURKERT</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">AVENTICS</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">Mahle</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">SMC</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">CKD</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">KOGRNE</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">NOK</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">TACO</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">KURODA</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">SUN</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">YPC</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">TKC</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">YSC</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">TPC</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">UNIVER</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">Camozzi</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">AMISCO</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">ROSS</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">MAC</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">Eltra</span>
    <span className="px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition cursor-default">CARLO GAVAZZI</span>
  </div>
  <p className="text-center text-xs text-muted-foreground mt-3">
    And many more...
  </p>
</section>

      {/* 6. CTA 行动召唤 */}
      <section className="text-center bg-primary/5 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-2">Need a specific part?</h2>
        <p className="text-muted-foreground text-sm mb-4">Contact us for quotes and availability</p>
        <Link href="/contact" className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm inline-block hover:bg-primary/90 transition">
          Contact Us
        </Link>
      </section>

    </main>
  )
}