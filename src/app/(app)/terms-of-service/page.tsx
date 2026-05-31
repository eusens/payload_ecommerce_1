// app/terms-of-service/page.tsx
import React from 'react'

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray dark:prose-invert">
      <h1>Terms of Service</h1>
      <p className="text-sm text-gray-500">Last updated: May 01, 2026</p>

      <h2>Agreement to Terms</h2>
      <p>
        By accessing or using our website and services, you agree to be bound by these Terms of Service. 
        If you disagree with any part of these terms, you may not access our services.
      </p>

      <h2>Products and Pricing</h2>
      <p>
        We reserve the right to modify or discontinue products without notice at any time. 
        Prices are subject to change. All descriptions and specifications are subject to change.
      </p>

      <h2>Orders and Payments</h2>
      <p>
        We reserve the right to refuse or cancel any order for reasons including but not limited to:
        product availability, errors in product descriptions or pricing, or suspected fraud.
      </p>

      <h2>Shipping and Delivery</h2>
      <p>
        Estimated shipping times are provided as guidelines only. We are not responsible for delays 
        caused by carriers, customs, or other circumstances beyond our control.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content on this website (including text, graphics, logos, images) is our property and 
        protected by intellectual property laws. You may not reproduce, distribute, or create derivative 
        works without our express written permission.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, 
        or consequential damages arising from your use of our products or services.
      </p>

      <h2>Governing Law</h2>
      <p>
        These terms shall be governed by and construed in accordance with the laws of China, 
        without regard to its conflict of law provisions.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. Your continued use of our services 
        after changes constitutes acceptance of the updated terms.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about these Terms of Service, please contact us at:{' '}
        <a href="mailto:sales@newsinoenergy.com" className="text-blue-600 hover:underline">
          sales@newsinoenergy.com
        </a>
      </p>

      <hr className="my-8" />
      <p className="text-xs text-gray-400">
        These Terms of Service were created for Newsino Energy Co Ltd.
      </p>
    </div>
  )
}