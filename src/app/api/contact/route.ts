// src/app/api/contact/route.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: configPromise })

  try {
    const { fullName, email, message, company, product, quantity, country } = await req.json()

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
    <p>${message}</p>
  `,
})

    return NextResponse.json({ message: 'Message sent successfully!' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 })
  }
}