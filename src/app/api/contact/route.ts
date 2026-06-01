// src/app/api/contact/route.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

// 验证 Turnstile Token
async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  
  // 如果没有配置 secret key，开发环境可以跳过验证（仅用于测试）
  if (!secret && process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Turnstile secret key not set, skipping verification in development')
    return true
  }
  
  if (!secret) {
    console.error('❌ TURNSTILE_SECRET_KEY is not configured')
    return false
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    })

    const data = await response.json()
    
    if (!data.success) {
      console.error('Turnstile verification failed:', data['error-codes'])
    }
    
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: configPromise })

  try {
    const { turnstileToken, fullName, email, message, company, product, quantity, country } = await req.json()

    // 1. 验证 Turnstile Token
    if (!turnstileToken) {
      return NextResponse.json(
        { message: 'Verification required. Please complete the security check.' },
        { status: 400 }
      )
    }

    const isValid = await verifyTurnstile(turnstileToken)
    if (!isValid) {
      return NextResponse.json(
        { message: 'Security verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // 2. 验证必填字段
    if (!fullName || !email || !message || !product) {
      return NextResponse.json(
        { message: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    // 3. 基础邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // 4. 发送邮件
    await payload.sendEmail({
      from: process.env.RESEND_FROM_ADDRESS,
      to: ['sales@panasonicservomotor.com'],
      cc: ['sales@eusens.com'],
      replyTo: email,
      subject: `New RFQ - ${product}`,
      html: `
        <h2>New Request for Quote</h2>

        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || '-'}</p>

        <hr/>

        <p><strong>Product / Model:</strong> ${product}</p>
        <p><strong>Quantity:</strong> ${quantity || '-'}</p>
        <p><strong>Country:</strong> ${country || '-'}</p>

        <hr/>

        <p><strong>Details:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
        
        <hr/>
        <p style="color: #666; font-size: 12px;">
          This request was verified by Cloudflare Turnstile.
        </p>
      `,
    })

    return NextResponse.json({ message: 'Message sent successfully!' })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json(
      { message: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}