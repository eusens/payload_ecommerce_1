// product.ts

export interface ProductData {
  title: string
  description: string          // 纯文本，会转换为 Lexical JSON 存入 description 字段
  longDescription?: string     // 可选：长描述（>500字），会转换为 layout.content.richText
  inventory: string
  price_in_u_s_d: string
  meta_title: string
  meta_description: string
  slug: string
  imageUrl: string
  galleryImages?: string[]
  categorySlug?: string
  categoryTitle?: string
}

export const products: ProductData[] = [
    {
      "title": "1756-A10/B",
      "description": "Panel 1756-A10 Allen Bradley",
      "longDescription": "Panel 1756-A10 Allen Bradley",
      "inventory": "6",
      "price_in_u_s_d": "36495",
      "meta_title": "1756-A10/B",
      "meta_description": "Panel 1756-A10 Allen Bradley",
      "slug": "1756-a10b",
      "imageUrl": "https://sanityimages.s3.amazonaws.com/IMG_1851.webp",
      "galleryImages": [
        "https://payloadcms-ecommerce.s3.amazonaws.com/Rexroth0820055501-1.jpg",
        "https://payloadcms-ecommerce.s3.amazonaws.com/EltraEL40A1000Z528P6X3PR.1-2.jpg"
      ],
      "categorySlug": "allen-bradley",
      "categoryTitle": "Allen Bradley"
    },
    {
      "title": "6ES7 972-0BB12-0XA0",
      "description": "Connector PROFIBUS Connection plug 12 MBit/s 90掳 Sealed",
      "longDescription": "Connector PROFIBUS Connection plug 12 MBit/s 90掳 Sealed",
      "inventory": "1",
      "price_in_u_s_d": "14372",
      "meta_title": "6ES7 972-0BB12-0XA0",
      "meta_description": "Connector PROFIBUS Connection plug 12 MBit/s 90掳 Sealed",
      "slug": "6es7-972-0bb12-0xa0",
      "imageUrl": "https://sanityimages.s3.amazonaws.com/IMG_5490.webp",
      "galleryImages": [
        "https://payloadcms-ecommerce.s3.amazonaws.com/PARKER944494Q-1.jpg",
        "https://payloadcms-ecommerce.s3.amazonaws.com/ATOSE-ME-T-05H_40DH07SA-3.jpg"
      ],
      "categorySlug": "siemens",
      "categoryTitle": "Siemens"
    }
  ]