'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function PrivacyPolicy() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <div className="h-1 w-20 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how Doski Motors collects, uses, and protects your personal information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Doski Motors. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
            <p className="text-gray-700">
              This privacy policy applies to all information collected through our website, 
              as well as any related services, sales, marketing, or events.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect personal information that you voluntarily provide to us when you express an interest in obtaining 
              information about us or our products and services, when you participate in activities on the website, 
              or otherwise when you contact us.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Personal Information:</strong> We may collect personal information such as your name, email address, 
              postal address, phone number, and other similar contact data.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Payment Information:</strong> If you make purchases, we collect payment information, including credit card 
              details and billing addresses. All payment information is stored by our payment processor, and you are encouraged 
              to review their privacy policy and contact them directly for responses to your questions.
            </p>
            <p className="text-gray-700">
              <strong>Automatically Collected Information:</strong> We automatically collect certain information when you visit, 
              use, or navigate the website. This information does not reveal your specific identity but may include device and 
              usage information, such as your IP address, browser and device characteristics, operating system, language preferences, 
              referring URLs, device name, country, location, information about how and when you use our website, and other technical information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use personal information collected via our website for a variety of business purposes described below:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>To provide and operate our services</li>
              <li>To improve our website and user experience</li>
              <li>To respond to inquiries and fulfill requests</li>
              <li>To send administrative information</li>
              <li>To send marketing and promotional communications</li>
              <li>To protect our rights and interests as well as the rights and interests of others</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sharing Your Information</h2>
            <p className="text-gray-700 mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, 
              any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              <li><strong>Third-Party Service Providers:</strong> We may share your information with third-party vendors, service providers, 
              contractors, or agents who perform services for us and require access to such information to do that work.</li>
              <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so 
              in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Privacy Rights</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>The right to access the personal information we have about you</li>
              <li>The right to request correction of inaccurate personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to opt-out of marketing communications</li>
              <li>The right to withdraw consent (where applicable)</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We have implemented appropriate technical and organizational security measures designed to protect the security 
              of any personal information we process. However, please also remember that we cannot guarantee that the internet 
              itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal 
              information to and from our website is at your own risk.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this privacy policy from time to time. The updated version will be indicated by an updated 
              "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you to 
              review this privacy policy frequently to be informed of how we are protecting your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions or comments about this policy, you may contact us at:
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