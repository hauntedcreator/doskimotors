'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-gray-900 to-blue-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#080b1a,#1e3a8a,#080b1a)] opacity-70"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <div className="h-1 w-20 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Please read these terms carefully before using our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              These Terms of Service constitute a legally binding agreement made between you and Doski Motors, concerning your access to and use of our website and services.
            </p>
            <p className="text-gray-700">
              By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Intellectual Property Rights</h2>
            <p className="text-gray-700 mb-4">
              Unless otherwise indicated, the website and all its content, features, and functionality (including but not limited to all information, text, displays, images, video, and audio) are owned by Doski Motors, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <p className="text-gray-700">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website, except as follows:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mt-2 mb-4 space-y-2">
              <li>Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials.</li>
              <li>You may store files that are automatically cached by your Web browser for display enhancement purposes.</li>
              <li>You may print or download one copy of a reasonable number of pages of the website for your own personal, non-commercial use and not for further reproduction, publication, or distribution.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Products and Services</h2>
            <p className="text-gray-700 mb-4">
              Doski Motors offers various automotive products and services, including but not limited to vehicle sales, financing, and maintenance services. All vehicle listings and descriptions are for informational purposes only and are subject to change without notice.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Accuracy of Information:</strong> While we strive to provide accurate and up-to-date information about our vehicles and services, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. If a product or service is not as described, your sole remedy is to return it in unused condition.
            </p>
            <p className="text-gray-700">
              <strong>Pricing and Availability:</strong> All prices are subject to change without notice. We reserve the right to limit the quantity of any items sold. We do not warrant that inventory or pricing information is error-free.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Vehicle Purchase Terms</h2>
            <p className="text-gray-700 mb-4">
              <strong>As-Is Condition:</strong> Unless otherwise stated in the written sales agreement, all vehicles are sold "AS IS" and Doski Motors makes no warranties, express or implied, as to the condition, merchantability, fitness for a particular purpose, or any other matter concerning the vehicles sold.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Deposits:</strong> Deposits placed on vehicles are generally non-refundable unless otherwise specified in writing. Deposits are intended to hold a vehicle for a specified period while financing or other arrangements are finalized.
            </p>
            <p className="text-gray-700">
              <strong>Documentation Fees:</strong> Additional fees such as documentation fees, title transfer fees, registration fees, and taxes may apply to vehicle purchases and are the responsibility of the buyer.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              By using our website and services, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information when filling out forms on the website.</li>
              <li>Maintain and promptly update your information to keep it accurate, current, and complete.</li>
              <li>Maintain the security of your account and accept all risks of unauthorized access to your account.</li>
              <li>Not use the website in any way that violates any applicable federal, state, local, or international law or regulation.</li>
              <li>Not use the website to transmit or send unsolicited commercial communications.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall Doski Motors, its officers, directors, employees, or agents, be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Errors, mistakes, or inaccuracies of content.</li>
              <li>Personal injury or property damage, of any nature whatsoever, resulting from your access to and use of our services.</li>
              <li>Any unauthorized access to or use of our secure servers and/or any and all personal information stored therein.</li>
              <li>Any interruption or cessation of transmission to or from our website.</li>
              <li>Any bugs, viruses, Trojan horses, or the like, which may be transmitted to or through our website by any third party.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Indemnification</h2>
            <p className="text-gray-700 mb-4">
              You agree to defend, indemnify, and hold harmless Doski Motors, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms of Service or your use of the website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              These Terms of Service shall be governed by and construed in accordance with the laws of the State of California, without giving effect to any principles of conflicts of law. Any action arising out of or relating to these terms shall be filed only in the state or federal courts located in San Diego County, California, and you hereby consent and submit to the personal jurisdiction of such courts for the purpose of litigating any such action.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-gray-700">
              By continuing to access or use our website after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              Questions about the Terms of Service should be sent to us at:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700">Doski Motors</p>
              <p className="text-gray-700">7490 Opportunity Rd STE 2900</p>
              <p className="text-gray-700">San Diego, CA 92111</p>
              <p className="text-gray-700">Phone: (619) 784-3791</p>
              <p className="text-gray-700">Email: info@doskimotors.com</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
} 