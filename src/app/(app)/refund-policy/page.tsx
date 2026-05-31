// app/refund-policy/page.tsx
import React from 'react'

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray dark:prose-invert">
      <h1>Return Policy</h1>
      <p className="text-sm text-gray-500">Last updated: May 01, 2026</p>

      <h2>Returns</h2>
      <p>
        All returns must be postmarked within <strong>thirty (30) days</strong> of the purchase date. 
        All returned items must be in new and unused condition, with all original tags and labels attached.
      </p>

      <h2>Return Process</h2>
      <p>
        To return an item, please email customer service at{' '}
        <a href="mailto:sales@newsinoenergy.com" className="text-blue-600 hover:underline">
          sales@newsinoenergy.com
        </a>{' '}
        to obtain a Return Merchandise Authorization (RMA) number. After receiving an RMA number, 
        place the item securely in its original packaging and mail your return to the following address:
      </p>

      <address className="not-italic bg-gray-50 p-4 rounded-lg border my-4">
        <strong>Newsino Energy Co Ltd</strong><br />
        Attn: Returns<br />
        RMA #<br />
        Xingya Road #32<br />
        Guangzhou, Guangdong 511447<br />
        China
      </address>

      <p>
        <strong>Please note:</strong> You will be responsible for all return shipping charges. 
        We strongly recommend that you use a trackable method to mail your return.
      </p>

      <h2>Refunds</h2>
      <p>
        After receiving your return and inspecting the condition of your item, we will process your return. 
        Please allow at least <strong>seven (7) days</strong> from the receipt of your item to process your return. 
        Refunds may take 1-2 billing cycles to appear on your credit card statement, depending on your credit card company. 
        We will notify you by email when your return has been processed.
      </p>

      <h2>Exceptions</h2>
      <p>
        For defective or damaged products, please contact us at the contact details below to arrange a refund or exchange.
      </p>

      <h2>Questions</h2>
      <p>
        If you have any questions concerning our return policy, please contact us at:{' '}
        <a href="mailto:sales@newsinoenergy.com" className="text-blue-600 hover:underline">
          sales@newsinoenergy.com
        </a>
      </p>

      <hr className="my-8" />

      <p className="text-xs text-gray-400">
        This Return Policy was created using a custom template for Newsino Energy Co Ltd.
      </p>
    </div>
  )
}