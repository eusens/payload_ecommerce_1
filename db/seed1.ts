// seed1.ts - 支持 upsert（存在则更新，不存在则创建）
import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { products, ProductData } from './products'

// ========== 分批配置（每次运行前手动修改） ==========
// 第一次运行: START_INDEX = 0, END_INDEX = 200
// 第二次运行: START_INDEX = 200, END_INDEX = 400
// 第三次运行: START_INDEX = 400, END_INDEX = 600
// ... 以此类推
const START_INDEX = 900      // ← 修改这里：起始索引
const END_INDEX = 1000      // ← 修改这里：结束索引（不包含）

const META_TITLE_MAX = 60
const META_DESCRIPTION_MAX = 150

console.log(`📊 分批导入配置 (Upsert模式): 索引 ${START_INDEX} - ${END_INDEX} (共 ${END_INDEX - START_INDEX} 个产品)`)

function truncateString(str: string, maxLength: number): string {
  if (!str) return ''
  if (str.length <= maxLength) return str
  console.warn(`⚠️  字符串过长 (${str.length} > ${maxLength})，已截断: ${str.substring(0, maxLength)}...`)
  return str.substring(0, maxLength)
}

// 将纯文本转换为 Lexical JSON
function textToLexical(text: string): any {
  if (!text || text.trim() === '') {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [{ type: 'paragraph', format: '', indent: 0, version: 1, children: [], direction: null, textStyle: '', textFormat: 0 }],
        direction: null,
      },
    }
  }

  // 按换行符分割段落
  const paragraphs = text.split(/\n+/)
  const children = paragraphs
    .filter(para => para.trim().length > 0)
    .map(para => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          mode: 'normal',
          text: para.trim(),
          type: 'text',
          style: '',
          detail: 0,
          format: 0,
          version: 1,
        },
      ],
      direction: null,
      textStyle: '',
      textFormat: 0,
    }))

  // 如果没有有效段落，添加一个空段落
  if (children.length === 0) {
    children.push({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      children: [],
      direction: null,
      textStyle: '',
      textFormat: 0,
    })
  }

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: children,
      direction: null,
    },
  }
}

// 检查产品是否存在（通过 slug）
async function findProductBySlug(payload: any, slug: string): Promise<any | null> {
  try {
    const existing = await payload.find({
      collection: 'products',
      where: {
        slug: { equals: slug }
      },
      limit: 1,
    })
    
    if (existing.docs && existing.docs.length > 0) {
      return existing.docs[0]
    }
    return null
  } catch (error) {
    console.error(`   ⚠️ 查找产品失败:`, error)
    return null
  }
}

// 上传图片
async function uploadImageFromUrl(payload: any, imageUrl: string, filename: string): Promise<number | null> {
  try {
    console.log(`   📥 下载图片: ${imageUrl.substring(0, 80)}...`)
    
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const buffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const ext = contentType.split('/')[1] || 'jpg'
    
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: filename,
      },
      file: {
        data: Buffer.from(buffer),
        name: `${filename}.${ext}`,
        mimetype: contentType,
      },
    })
    
    console.log(`   ✅ 图片上传成功: ${media.id}`)
    return media.id
  } catch (error) {
    console.error(`   ❌ 图片上传失败: ${imageUrl.substring(0, 80)}`, error)
    return null
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

// 查找或创建分类
async function findOrCreateCategory(payload: any, categorySlug?: string, categoryTitle?: string): Promise<number | null> {
  if (!categorySlug && !categoryTitle) {
    return null
  }
  
  const title = categoryTitle || categorySlug || ''
  let slug: string
  
  if (categorySlug) {
    slug = categorySlug
  } else if (categoryTitle) {
    slug = generateSlug(categoryTitle)
  } else {
    return null
  }
  
  if (!title || !slug) {
    console.warn(`   ⚠️  分类信息不完整，跳过`)
    return null
  }
  
  try {
    const existing = await payload.find({
      collection: 'categories',
      where: {
        slug: { equals: slug }
      },
      limit: 1,
    })
    
    if (existing.docs && existing.docs.length > 0) {
      const category = existing.docs[0]
      console.log(`   📁 找到现有分类: ${category.title} (ID: ${category.id})`)
      return category.id
    }
    
    console.log(`   📝 分类不存在，正在创建: ${title}`)
    const newCategory = await payload.create({
      collection: 'categories',
      data: {
        title: title,
        slug: slug,
        generate_slug: false,
      },
    })
    
    console.log(`   ✅ 创建分类成功: ${newCategory.title} (ID: ${newCategory.id})`)
    return newCategory.id
    
  } catch (error) {
    console.error(`   ❌ 查找/创建分类失败:`, error)
    return null
  }
}

// 随机获取关联产品 ID（排除当前产品，同分类）
async function getRandomRelatedProducts(
  payload: any, 
  currentProductId: number | null, 
  categoryId: number | null,
  minCount: number = 2,
  maxCount: number = 4
): Promise<number[]> {
  try {
    // 随机决定关联数量（2-4 个）
    const targetCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount
    
    // 构建查询条件
    const where: any = {
      _status: { equals: 'published' }
    }
    
    // 排除当前产品
    if (currentProductId) {
      where.id = { not_equals: currentProductId }
    }
    
    // 只关联同分类的产品
    if (categoryId) {
      where.categories = { equals: categoryId }
    } else {
      // 如果没有分类，就返回空
      return []
    }
    
    const existingProducts = await payload.find({
      collection: 'products',
      where: where,
      limit: 20,  // 多查一些，以便随机选择
    })
    
    if (!existingProducts.docs || existingProducts.docs.length === 0) {
      return []
    }
    
    // 如果同分类产品不足，返回所有可用的（排除自身）
    if (existingProducts.docs.length <= targetCount) {
      const allIds = existingProducts.docs.map((p: any) => p.id)
      console.log(`   🎲 随机关联 ${allIds.length} 个产品 (同分类，不足目标数)`)
      return allIds
    }
    
    // 随机打乱并取前 targetCount 个
    const shuffled = [...existingProducts.docs]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    const selected = shuffled.slice(0, targetCount)
    const selectedIds = selected.map((p: any) => p.id)
    
    console.log(`   🎲 随机关联 ${selectedIds.length} 个产品 (同分类)`)
    return selectedIds
    
  } catch (error) {
    console.error(`   ⚠️ 获取随机关联产品失败:`, error)
    return []
  }
}

async function seed() {
  console.log('🌱 开始种子数据导入 (Upsert模式 - 存在则更新)...\n')
  
  if (!process.env.PAYLOAD_SECRET) {
    console.error('❌ 错误: PAYLOAD_SECRET 未设置，请检查 .env 文件')
    process.exit(1)
  }
  
  const payload = await getPayload({ config: configPromise })
  
  // 只处理指定范围的产品
  const productsToProcess = products.slice(START_INDEX, END_INDEX)
  
  console.log(`📦 本次将处理 ${productsToProcess.length} 个产品 (索引 ${START_INDEX} - ${END_INDEX - 1})`)
  console.log(`📊 总产品数: ${products.length}, 已完成: ${START_INDEX}, 剩余: ${products.length - END_INDEX}`)
  console.log('')
  
  let createdCount = 0
  let updatedCount = 0
  let failCount = 0
  
  for (let i = 0; i < productsToProcess.length; i++) {
    const item = productsToProcess[i]
    const globalIndex = START_INDEX + i
    
    try {
      console.log(`📦 [${globalIndex + 1}/${products.length}] 处理产品: ${item.title.substring(0, 60)}`)
      
      // 1. 处理 slug
      let slug = item.slug
      if (!slug || slug.trim() === '') {
        slug = generateSlug(item.title)
        console.log(`   ℹ️  slug 为空，自动生成: ${slug}`)
      }
      slug = slug.toLowerCase().replace(/\s+/g, '-')
      
      // 2. 检查产品是否已存在
      const existingProduct = await findProductBySlug(payload, slug)
      const isUpdate = !!existingProduct
      
      if (isUpdate) {
        console.log(`   🔄 产品已存在 (ID: ${existingProduct.id})，将执行更新...`)
      }
      
      // 3. 查找或创建分类
      const categoryId = await findOrCreateCategory(payload, item.categorySlug, item.categoryTitle)
      
      // 4. 处理 meta_title
      let metaTitle = item.meta_title || item.title
      metaTitle = truncateString(metaTitle, META_TITLE_MAX)
      
      // 5. 处理 meta_description
      let metaDescription = item.meta_description || item.description
      metaDescription = truncateString(metaDescription, META_DESCRIPTION_MAX)
      
      // 6. 上传所有图片
      const galleryItems: { imageId: number; order: number }[] = []
      
      let mainImageId: number | null = null
      if (item.imageUrl) {
        console.log(`   📸 上传主图...`)
        mainImageId = await uploadImageFromUrl(payload, item.imageUrl, `${item.title}_main`)
        if (mainImageId) {
          galleryItems.push({ imageId: mainImageId, order: 1 })
        }
      }
      
      if (item.galleryImages && item.galleryImages.length > 0) {
        console.log(`   📸 上传 ${item.galleryImages.length} 张额外图片...`)
        for (let j = 0; j < item.galleryImages.length; j++) {
          const imgUrl = item.galleryImages[j]
          const extraImageId = await uploadImageFromUrl(payload, imgUrl, `${item.title}_gallery_${j + 1}`)
          if (extraImageId) {
            galleryItems.push({ imageId: extraImageId, order: galleryItems.length + 1 })
          }
        }
      }
      
      // 7. 构建产品数据
      // 短描述：description 字段（图片左侧）
      const shortDescription = item.description || ''
      // 长描述：longDescription 字段（图片下方，无论长短）
      const longDescription = item.longDescription || ''
      
      // 短描述转换
      const descriptionLexical = textToLexical(shortDescription)
      
      // 长描述：无论长度多少，都放入 layout（图片下方）
      let layoutData = null
      if (longDescription && longDescription.trim() !== '') {
        console.log(`   📝 长描述长度: ${longDescription.length} 字，将放入 layout (图片下方)`)
        layoutData = [
          {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: textToLexical(longDescription),
              },
            ],
          },
        ]
      }
      
      const productData: any = {
        title: item.title,
        description: descriptionLexical,
        inventory: Number(item.inventory),
        priceInUSDEnabled: true,
        priceInUSD: Number(item.price_in_u_s_d),
        slug: slug,
        generate_slug: false,
        _status: 'published',
        meta: {
          title: metaTitle,
          description: metaDescription,
        },
      }
      
      // 添加 layout（只要有长描述就添加）
      if (layoutData) {
        productData.layout = layoutData
        console.log(`   🎨 已添加 layout (长描述区域，独立于图片左侧)`)
      }
      
      // 添加分类
      if (categoryId) {
        productData.categories = [categoryId]
        console.log(`   📌 关联分类 ID: ${categoryId}`)
      }
      
      // 添加主图到 meta
      if (mainImageId) {
        productData.meta.image = mainImageId
      }
      
      // 添加 gallery
      if (galleryItems.length > 0) {
        productData.gallery = galleryItems.map(item => ({
          image: item.imageId,
          _order: item.order,
        }))
        console.log(`   🖼️  添加 ${galleryItems.length} 张图片到 gallery`)
      }
      
      // 8. 执行创建或更新
      let product
      if (isUpdate) {
        product = await payload.update({
          collection: 'products',
          id: existingProduct.id,
          data: productData,
        })
        console.log(`✅ 产品更新成功: ${product.title} (ID: ${product.id})`)
        updatedCount++
      } else {
        product = await payload.create({
          collection: 'products',
          data: productData,
        })
        console.log(`✅ 产品创建成功: ${product.title} (ID: ${product.id})`)
        createdCount++
      }
      
      // 9. 随机关联产品（创建后或更新后）
      if (categoryId) {
        const relatedIds = await getRandomRelatedProducts(payload, product.id, categoryId, 2, 4)
        if (relatedIds.length > 0) {
          await payload.update({
            collection: 'products',
            id: product.id,
            data: {
              relatedProducts: relatedIds
            },
          })
          console.log(`   🔗 已添加 ${relatedIds.length} 个随机关联产品 (同分类)`)
        } else {
          console.log(`   ℹ️ 没有找到可关联的同分类产品`)
        }
      }
      
      console.log('')
      
    } catch (error) {
      console.error(`❌ 导入失败: ${item.title}`, error)
      failCount++
      console.log('')
    }
  }
  
  console.log('='.repeat(60))
  console.log(`🎉 分批导入完成 (Upsert模式)!`)
  console.log(`   ✅ 创建: ${createdCount} 个`)
  console.log(`   🔄 更新: ${updatedCount} 个`)
  console.log(`   ❌ 失败: ${failCount} 个`)
  console.log(`   📊 本次处理范围: 索引 ${START_INDEX} - ${END_INDEX - 1}`)
  console.log(`   💡 下次运行请修改 START_INDEX = ${END_INDEX}, END_INDEX = ${END_INDEX + 200}`)
  console.log('='.repeat(60))
  process.exit(0)
}

seed().catch((error) => {
  console.error('❌ 种子脚本执行失败:', error)
  process.exit(1)
})