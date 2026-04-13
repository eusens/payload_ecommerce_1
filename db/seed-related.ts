// seed-related.ts - 只更新相关产品关系
import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// ========== 配置 ==========
// 测试模式：只处理前 N 个产品（设为 0 或 undefined 则处理全部）
const TEST_LIMIT = 0  // ← 修改这里：测试时设为 10，正式运行时设为 0 或删除这行

// 定义产品之间的关联关系
const RELATED_MAPPINGS: Record<string, string[]> = {
  // 可以在这里手动配置
}

async function autoAssignRelatedProducts(payload: any, testLimit: number = 0) {
  console.log('🤖 自动关联同品牌产品...')
  if (testLimit > 0) {
    console.log(`🧪 测试模式: 只处理前 ${testLimit} 个产品`)
  }
  
  // 获取所有产品
  const allProducts = await payload.find({
    collection: 'products',
    limit: 1000,
    where: { _status: { equals: 'published' } },
    select: {
      id: true,
      slug: true,
      title: true,
      categories: true,
    },
  })
  
  console.log(`📊 共找到 ${allProducts.docs.length} 个产品`)
  
  // 限制处理数量
  let productsToProcess = allProducts.docs
  if (testLimit > 0 && testLimit < productsToProcess.length) {
    productsToProcess = productsToProcess.slice(0, testLimit)
    console.log(`🧪 测试模式: 实际处理前 ${productsToProcess.length} 个产品`)
  }
  
  // 按分类/品牌分组
  const productsByCategory: Record<string, any[]> = {}
  
  for (const product of productsToProcess) {
    let categoryName = 'Other'
    if (product.categories && product.categories.length > 0) {
      try {
        const category = await payload.findByID({
          collection: 'categories',
          id: product.categories[0] as number,
        })
        categoryName = category?.title || 'Other'
      } catch (e) {
        categoryName = 'Other'
      }
    }
    
    if (!productsByCategory[categoryName]) {
      productsByCategory[categoryName] = []
    }
    productsByCategory[categoryName].push(product)
  }
  
  console.log(`📊 按分类分组: ${Object.keys(productsByCategory).length} 个分类`)
  
  let totalUpdated = 0
  let totalSkipped = 0
  
  for (const [category, products] of Object.entries(productsByCategory)) {
    console.log(`\n🏷️ 处理分类: ${category} (${products.length} 个产品)`)
    
    for (const product of products) {
      // 找出同分类的其他产品
      const otherProducts = products.filter(p => p.id !== product.id)
      if (otherProducts.length === 0) {
        console.log(`   ⏭️ 跳过: ${product.title} (无同分类产品)`)
        totalSkipped++
        continue
      }
      
      // 随机选择 2-4 个相关产品
      const shuffled = [...otherProducts]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      const relatedCount = Math.min(4, shuffled.length)
      const selectedRelated = shuffled.slice(0, relatedCount)
      const relatedIds = selectedRelated.map(p => p.id)
      
      // 更新产品
      await payload.update({
        collection: 'products',
        id: product.id,
        data: {
          relatedProducts: relatedIds,
        },
      })
      
      console.log(`   ✅ ${product.title.substring(0, 40)}... -> 关联 ${relatedIds.length} 个产品`)
      totalUpdated++
      
      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  console.log(`\n📊 统计:`)
  console.log(`   ✅ 已更新: ${totalUpdated} 个产品`)
  console.log(`   ⏭️ 跳过: ${totalSkipped} 个产品`)
  if (testLimit > 0) {
    console.log(`\n💡 测试完成！确认无误后，请将 TEST_LIMIT 设为 0 或删除该变量，然后重新运行全量更新。`)
  }
  return totalUpdated
}

// 清空所有 relatedProducts
async function clearAllRelated(payload: any, testLimit: number = 0) {
  console.log('🗑️ 清空所有相关产品关系...')
  if (testLimit > 0) {
    console.log(`🧪 测试模式: 只清空前 ${testLimit} 个产品`)
  }
  
  const allProducts = await payload.find({
    collection: 'products',
    limit: 1000,
    where: { _status: { equals: 'published' } },
    select: { id: true },
  })
  
  let productsToClear = allProducts.docs
  if (testLimit > 0 && testLimit < productsToClear.length) {
    productsToClear = productsToClear.slice(0, testLimit)
    console.log(`🧪 测试模式: 实际清空前 ${productsToClear.length} 个产品`)
  }
  
  let clearedCount = 0
  for (const product of productsToClear) {
    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        relatedProducts: [],
      },
    })
    clearedCount++
    
    if (clearedCount % 50 === 0) {
      console.log(`   已清空 ${clearedCount}/${productsToClear.length}`)
    }
  }
  
  console.log(`✅ 清空完成！共清空 ${clearedCount} 个产品`)
  return clearedCount
}

async function main() {
  console.log('🔗 开始更新相关产品关系...\n')
  
  if (!process.env.PAYLOAD_SECRET) {
    console.error('❌ 错误: PAYLOAD_SECRET 未设置，请检查 .env 文件')
    process.exit(1)
  }
  
  const payload = await getPayload({ config: configPromise })
  
  // 从命令行参数获取模式，或使用默认值
  const mode = process.argv[2] || 'auto'
  
  // 是否使用测试限制（可通过命令行参数覆盖）
  const useTestLimit = process.argv[3] === 'test' || TEST_LIMIT > 0
  const testLimit = TEST_LIMIT > 0 ? TEST_LIMIT : (process.argv[3] === 'test' ? 10 : 0)
  
  switch (mode) {
    case 'auto':
      console.log('🤖 模式: 自动关联（同分类产品）')
      await autoAssignRelatedProducts(payload, testLimit)
      break
      
    case 'clear':
      console.log('🗑️ 模式: 清空所有关联')
      await clearAllRelated(payload, testLimit)
      break
      
    default:
      console.log(`
使用方法:
  npx tsx ./db/seed-related.ts auto        # 自动关联同分类产品（全量）
  npx tsx ./db/seed-related.ts auto test   # 自动关联（测试模式，只处理前10个）
  npx tsx ./db/seed-related.ts clear       # 清空所有关联（全量）
  npx tsx ./db/seed-related.ts clear test  # 清空所有关联（测试模式，只清空前10个）

提示: 也可以修改脚本中的 TEST_LIMIT 变量来控制测试数量
      `)
      process.exit(0)
  }
  
  console.log('\n🎉 相关产品更新完成！')
  process.exit(0)
}

main().catch((error) => {
  console.error('❌ 脚本执行失败:', error)
  process.exit(1)
})