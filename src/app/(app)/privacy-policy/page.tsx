// app/privacy-policy/page.tsx
import React from 'react'

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-gray-500">Last updated: May 01, 2026</p>

      <h2>Information We Collect</h2>
      <p>
        We collect information you provide directly to us, including:
      </p>
      <ul>
        <li>Name and contact information (email, phone number, shipping address)</li>
        <li>Account credentials (username, password)</li>
        <li>Payment information (processed securely via third-party payment processors)</li>
        <li>Communication preferences and customer support inquiries</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Process and fulfill your orders</li>
        <li>Communicate with you about orders, products, and promotions</li>
        <li>Improve our products and services</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>Information Sharing</h2>
      <p>
        We do not sell, trade, or rent your personal information to third parties. 
        We may share information with trusted service providers who assist in operating our website, 
        conducting business, or servicing you (e.g., shipping carriers, payment processors).
      </p>

      <h2>Data Security</h2>
      <p>
        We implement reasonable security measures to protect your personal information. 
        However, no method of transmission over the internet is 100% secure.
      </p>

      <h2>Your Rights</h2>
      <p>
        Depending on your location, you may have the right to access, correct, or delete your personal information. 
        To exercise these rights, please contact us at{' '}
        <a href="mailto:sales@newsinoenergy.com" className="text-blue-600 hover:underline">
          sales@newsinoenergy.com
        </a>.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at:{' '}
        <a href="mailto:sales@newsinoenergy.com" className="text-blue-600 hover:underline">
          sales@newsinoenergy.com
        </a>
      </p>

      <hr className="my-8" />
      <p className="text-xs text-gray-400">
        This Privacy Policy was created for Newsino Energy Co Ltd.
      </p>
    </div>
  )
}