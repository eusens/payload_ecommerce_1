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
        "https://payloadcms-ecommerce.s3.amazonaws.com/HYDAC0240R010BN3HC-1.jpg",
        "https://payloadcms-ecommerce.s3.amazonaws.com/MOOGJ761-003A-2.jpg"
      ],
      "categorySlug": "allen-bradley",
      "categoryTitle": "Allen Bradley"
    },
    {
      "title": "1786-RG6",
      "description": "Allen-Bradley 1786-RG6 Coaxial Cable (meters)",
      "longDescription": "Allen-Bradley 1786-RG6 Coaxial Cable (meters)",
      "inventory": "6",
      "price_in_u_s_d": "33162",
      "meta_title": "1786-RG6",
      "meta_description": "Allen-Bradley 1786-RG6 Coaxial Cable (meters)",
      "slug": "1786-rg6",
      "imageUrl": "https://sanityimages.s3.amazonaws.com/IMG_2540.webp",
      "galleryImages": [
        "https://payloadcms-ecommerce.s3.amazonaws.com/MAC56C-56-RA-5.jpg",
        "https://payloadcms-ecommerce.s3.amazonaws.com/ATOSE-ME-L-01H_40DL67SA-1.jpg"
      ],
      "categorySlug": "allen-bradley",
      "categoryTitle": "Allen Bradley"
    }
  ]