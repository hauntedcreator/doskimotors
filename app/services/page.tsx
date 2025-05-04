'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { motion, AnimatePresence } from 'framer-motion';
import { FaCarSide, FaMoneyCheckAlt, FaClipboardCheck, FaHandsHelping, FaExchangeAlt, FaHeadset, FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import confettiSVG from '/public/images/confetti.svg';
import { toast } from 'react-hot-toast';
import PageLoader from '@/components/PageLoader';
import Head from 'next/head';
import { delayLoadResources, registerPageLoad, useRouteChangeHandler } from '../simplify-services';

// Add export const dynamic = 'force-static' to optimize page load
export const dynamic = 'force-static';

interface RepairForm {
  name: string;
  email: string;
  desc: string;
  files: File[];
}

interface TradeInForm {
  vehicle: string;
  mileage: string;
  condition: string;
  email: string;
  files: File[];
}

interface ShippingForm {
  destination: string;
  zip: string;
}

interface CryptoRates {
  btc: number | null;
  eth: number | null;
  sol: number | null;
}

export default function ServicesPage() {
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [tradeInSubmitted, setTradeInSubmitted] = useState(false);
  const [repairSubmitted, setRepairSubmitted] = useState(false);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [cryptoRates, setCryptoRates] = useState<CryptoRates>({ btc: null, eth: null, sol: null });
  const [usdAmount, setUsdAmount] = useState('');
  const [repairForm, setRepairForm] = useState<RepairForm>({ name: '', email: '', desc: '', files: [] });
  const [tradeInForm, setTradeInForm] = useState<TradeInForm>({ vehicle: '', mileage: '', condition: 'Excellent', email: '', files: [] });
  const [shippingForm, setShippingForm] = useState<ShippingForm>({ destination: '', zip: '' });
  const [shippingEstimate, setShippingEstimate] = useState<string | null>(null);
  const [repairLoading, setRepairLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Simplified animation variants
  const simpleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Register page load metrics and force reload for problematic routes
  useEffect(() => {
    const completeLoad = registerPageLoad('Services');
    useRouteChangeHandler();
    
    return () => {
      completeLoad();
    };
  }, []);
  
  // Defer loading of non-critical resources
  useEffect(() => {
    const cleanup = delayLoadResources(() => {
      // Initialize any heavier components or fetch data here
      console.log('Services page - deferred resources loaded');
    });
    
    return cleanup;
  }, []);

  // Fetch crypto rates
  async function fetchCryptoRates() {
    try {
      setCryptoLoading(true);
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
      const data = await response.json();
      setCryptoRates({
        btc: data.bitcoin.usd,
        eth: data.ethereum.usd,
        sol: data.solana.usd
      });
    } catch (error) {
      toast.error('Failed to fetch crypto rates. Please try again later.');
    } finally {
      setCryptoLoading(false);
    }
  }

  // Simple confetti effect
  function launchConfetti() {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width = 400;
    const H = canvas.height = 200;
    const confettiColors = ['#60a5fa', '#fbbf24', '#34d399', '#f472b6', '#f87171'];
    let confetti = Array.from({length: 60}, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 6 + 4,
      d: Math.random() * 40 + 10,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      tilt: Math.random() * 10 - 10
    }));
    let angle = 0;
    let running = true;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      confetti.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
        ctx.fillStyle = c.color;
        ctx.fill();
      });
      update();
    }
    function update() {
      angle += 0.01;
      confetti.forEach(c => {
        c.y += Math.cos(angle + c.d) + 1 + c.r / 2;
        c.x += Math.sin(angle) * 2;
        if (c.x > W || c.x < 0 || c.y > H) {
          c.x = Math.random() * W;
          c.y = -10;
        }
      });
    }
    let frame = 0;
    function animate() {
      if (!running) return;
      draw();
      frame++;
      requestAnimationFrame(animate);
    }
    animate();
    setTimeout(() => { running = false; }, 3000);
  }

  // Email sending helper
  async function sendEmail(data: { email: string; [key: string]: any }) {
    try {
      setEmailSending(true);
      // Add validation
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // First save to leads database
      const leadData = {
        ...data,
        name: data.name || 'Service Request',
        subject: data.subject || 'Service Request',
        message: data.message || data.desc || '',
        source: 'services-page'
      };

      // Submit to leads system
      const leadsResponse = await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      
      if (!leadsResponse.ok) {
        console.warn('Issue saving to leads system:', await leadsResponse.text());
        // Continue anyway to try email
      }
      
      // Send email notification
      const emailResponse = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('Email API error:', errorText);
        throw new Error('Failed to send email. Please try again.');
      }
      
      toast.success('Message sent successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setEmailSending(false);
    }
  }

  // Simplify focus trap for modals for better performance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowRepairModal(false);
        setShowTradeInModal(false);
        setShowShippingModal(false);
        setShowInspectionModal(false);
        setShowCryptoModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Defer crypto rates fetching to improve initial load
  useEffect(() => {
    // Delay non-essential operations
    const timer = setTimeout(() => {
      if (showCryptoModal) {
        fetchCryptoRates();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [showCryptoModal]);

  return (
    <PageLoader>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        {/* Hero Section with Gradient Animation */}
        <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
          {/* Gradient Background with Animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-blue-900">
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] z-0"></div>
            <motion.div 
              className="absolute -inset-[10px] opacity-40 z-0"
              animate={{ 
                background: [
                  'radial-gradient(circle at 25% 100%, rgba(20, 30, 100, 0.5) 0%, rgba(0, 0, 0, 0) 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(20, 30, 100, 0.5) 0%, rgba(0, 0, 0, 0) 50%)',
                  'radial-gradient(circle at 25% 10%, rgba(20, 30, 100, 0.5) 0%, rgba(0, 0, 0, 0) 50%)',
                  'radial-gradient(circle at 50% 50%, rgba(20, 30, 100, 0.5) 0%, rgba(0, 0, 0, 0) 50%)',
                  'radial-gradient(circle at 25% 100%, rgba(20, 30, 100, 0.5) 0%, rgba(0, 0, 0, 0) 50%)',
                ]
              }}
              transition={{ 
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>
          </div>
          
          <div className="relative z-10 text-center py-24 px-4 w-full">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
            >
              Our Services
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col items-center gap-6"
            >
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Comprehensive solutions for every step of your car-buying journey.
              </p>
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </motion.div>
          </div>
        </section>
        <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
              <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } }
              }}
            >
              <motion.div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start hover:scale-[1.025] hover:shadow-2xl transition-transform duration-300" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <FaCarSide className="text-blue-600 text-3xl mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Vehicle Sales</h2>
                <p className="text-gray-600 mb-4">Browse our extensive collection of premium vehicles. From luxury cars to performance vehicles, we have something for every taste and budget. Our transparent process and expert team ensure you drive away with confidence.</p>
                <ul className="text-gray-600 space-y-2 text-sm mb-4">
                  <li>• New and pre-owned vehicles</li>
                  <li>• Luxury and performance cars</li>
                  <li>• Competitive pricing</li>
                  <li>• Transparent documentation</li>
                </ul>
                <a href="/vehicles" className="mt-auto inline-block px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Browse Here</a>
              </motion.div>
              <motion.div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start hover:scale-[1.025] hover:shadow-2xl transition-transform duration-300" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                <FaClipboardCheck className="text-blue-600 text-3xl mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Vehicle Inspection</h2>
                <p className="text-gray-600 mb-4">Every vehicle in our inventory undergoes a thorough, multi-point inspection by certified professionals to ensure the highest quality and reliability. We provide detailed reports for your peace of mind.</p>
                <ul className="text-gray-600 space-y-2 text-sm mb-4">
                  <li>• Multi-point inspection</li>
                  <li>• Performance & safety testing</li>
                  <li>• Detailed vehicle history</li>
                  <li>• Tesla & EV expertise</li>
                </ul>
                <button onClick={() => setShowInspectionModal(true)} className="mt-auto inline-block px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">What's Included?</button>
              </motion.div>
              <motion.div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start hover:scale-[1.025] hover:shadow-2xl transition-transform duration-300" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                <FaHandsHelping className="text-blue-600 text-3xl mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Tesla Approved Repair Shop</h2>
                <p className="text-gray-600 mb-4">Our professional repair shop is Tesla-approved, offering certified repairs, maintenance, and upgrades. We use genuine parts and advanced diagnostics for all Tesla models.</p>
                <ul className="text-gray-600 space-y-2 text-sm mb-4">
                  <li>• Tesla-certified technicians</li>
                  <li>• Genuine parts & warranty</li>
                  <li>• EV diagnostics & upgrades</li>
                  <li>• Fast turnaround</li>
                </ul>
                <button onClick={() => setShowRepairModal(true)} className="mt-auto inline-block px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Request a Quote</button>
              </motion.div>
              <motion.div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start hover:scale-[1.025] hover:shadow-2xl transition-transform duration-300" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
                <FaExchangeAlt className="text-blue-600 text-3xl mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Trade-In Services</h2>
                <p className="text-gray-600 mb-4">Get the best value for your current vehicle with our fair and transparent trade-in process. Instantly estimate your car's value and enjoy a hassle-free transaction.</p>
                <ul className="text-gray-600 space-y-2 text-sm mb-4">
                  <li>• Fair market evaluation</li>
                  <li>• Quick appraisal process</li>
                  <li>• Competitive offers</li>
                  <li>• Hassle-free transaction</li>
                </ul>
                <button onClick={() => setShowTradeInModal(true)} className="mt-auto inline-block px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Get Live Estimate</button>
              </motion.div>
              <motion.div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start hover:scale-[1.025] hover:shadow-2xl transition-transform duration-300" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
                <FaCarSide className="text-blue-600 text-3xl mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Worldwide Delivery</h2>
                <p className="text-gray-600 mb-4">We offer secure, insured delivery of your vehicle anywhere in the world. Our logistics partners ensure your car arrives safely and on time, no matter where you are.</p>
                <ul className="text-gray-600 space-y-2 text-sm mb-4">
                  <li>• International shipping</li>
                  <li>• Fully insured transport</li>
                  <li>• Door-to-door service</li>
                  <li>• Real-time tracking</li>
                </ul>
                <button onClick={() => setShowShippingModal(true)} className="mt-auto inline-block px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Estimate Shipping</button>
              </motion.div>
              <motion.div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start hover:scale-[1.025] hover:shadow-2xl transition-transform duration-300" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}>
                <FaMoneyCheckAlt className="text-blue-600 text-3xl mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Cash or Crypto Payment Accepted</h2>
                <p className="text-gray-600 mb-4">We accept a variety of payment methods, including cash and major cryptocurrencies. Enjoy a seamless, secure transaction tailored to your preferences.</p>
                <ul className="text-gray-600 space-y-2 text-sm mb-4">
                  <li>• USD, Bitcoin, Ethereum, and more</li>
                  <li>• Secure payment processing</li>
                  <li>• Instant confirmation</li>
                  <li>• Privacy respected</li>
                </ul>
                <button onClick={() => { setShowCryptoModal(true); }} className="mt-auto inline-block px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition flex items-center gap-2"><FaBitcoin /> Crypto Calculator</button>
              </motion.div>
            </motion.div>
          </div>

          {/* Tesla Repair Modal */}
          <AnimatePresence>
            {showRepairModal && (
          <motion.div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                initial="hidden"
                animate="visible"
                exit="exit" 
                variants={simpleVariants}
              >
                <motion.div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
                  <button
                    onClick={() => { setShowRepairModal(false); setRepairSubmitted(false); setRepairForm({ name: '', email: '', desc: '', files: [] }); }}
                    className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl"
                    aria-label="Close modal"
                  >
                    &times;
                  </button>
                  <h3 id="repair-modal-title" className="text-2xl font-bold text-blue-900 mb-4">Request a Tesla Repair Quote</h3>
                  {repairSubmitted ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-xl font-semibold text-green-600 mb-2">Thank you for your request!</div>
                      <div className="text-gray-700 mb-4 text-center">We have received your quote request and will get back to you soon.</div>
                      <button onClick={() => { setShowRepairModal(false); setRepairSubmitted(false); }} className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Close</button>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={async e => {
                      e.preventDefault();
                      setRepairLoading(true);
                      let uploadedUrls: string[] = [];
                      if (repairForm.files && repairForm.files.length > 0) {
                        const formData = new FormData();
                        repairForm.files.forEach(file => formData.append('images', file));
                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                        const data = await res.json();
                        uploadedUrls = data.urls || [];
                      }
                      setRepairSubmitted(true);
                      setTimeout(launchConfetti, 100);
                      await sendEmail({ name: repairForm.name, email: repairForm.email, subject: 'Tesla Repair Quote', message: repairForm.desc, files: uploadedUrls });
                      setRepairLoading(false);
                    }}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" className="w-full border rounded-md px-3 py-2" required value={repairForm.name} onChange={e => setRepairForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full border rounded-md px-3 py-2" required value={repairForm.email} onChange={e => setRepairForm(f => ({ ...f, email: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Describe the issue</label>
                        <textarea className="w-full border rounded-md px-3 py-2" rows={3} required value={repairForm.desc} onChange={e => setRepairForm(f => ({ ...f, desc: e.target.value }))}></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photos (optional)</label>
                        <input type="file" multiple accept="image/*" className="w-full" onChange={e => setRepairForm(f => ({ ...f, files: Array.from(e.target.files || []) }))} />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Submit Quote Request</button>
                    </form>
                  )}
                  {repairLoading && <div className="text-blue-600 text-center">Uploading photos...</div>}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trade-In Modal */}
          <AnimatePresence>
            {showTradeInModal && (
              <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial="hidden" animate="visible" exit="exit" variants={simpleVariants}>
                <motion.div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative" initial="hidden" animate="visible" exit="exit" variants={simpleVariants}>
                  <button onClick={() => { setShowTradeInModal(false); setTradeInSubmitted(false); setTradeInForm({ vehicle: '', mileage: '', condition: 'Excellent', email: '', files: [] }); }} className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl">&times;</button>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Get a Live Trade-In Estimate</h3>
                  {tradeInSubmitted ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-xl font-semibold text-green-600 mb-2">Thank you for your request!</div>
                      <div className="text-gray-700 mb-4 text-center">To get a live estimate for your vehicle, please visit Kelley Blue Book (KBB) below.</div>
                      <a href="https://www.kbb.com/whats-my-car-worth/" target="_blank" rel="noopener noreferrer" className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition mb-2">Check on KBB</a>
                      <button onClick={() => { setShowTradeInModal(false); setTradeInSubmitted(false); }} className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition">Close</button>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={async e => { e.preventDefault(); setTradeInSubmitted(true); await sendEmail({ name: 'Trade-In', email: tradeInForm.email, subject: 'Trade-In Estimate', message: `Vehicle: ${tradeInForm.vehicle}\nMileage: ${tradeInForm.mileage}\nCondition: ${tradeInForm.condition}` }); }}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Year, Make & Model</label>
                        <input type="text" className="w-full border rounded-md px-3 py-2" required value={tradeInForm.vehicle} onChange={e => setTradeInForm(f => ({ ...f, vehicle: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                        <input type="number" className="w-full border rounded-md px-3 py-2" required value={tradeInForm.mileage} onChange={e => setTradeInForm(f => ({ ...f, mileage: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                        <select className="w-full border rounded-md px-3 py-2" value={tradeInForm.condition} onChange={e => setTradeInForm(f => ({ ...f, condition: e.target.value }))}>
                          <option>Excellent</option>
                          <option>Good</option>
                          <option>Fair</option>
                          <option>Poor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full border rounded-md px-3 py-2" required value={tradeInForm.email} onChange={e => setTradeInForm(f => ({ ...f, email: e.target.value }))} />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Get Estimate</button>
                      <div className="text-xs text-gray-500 mt-2">For a live KBB estimate, <a href='https://www.kbb.com/whats-my-car-worth/' target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>click here</a>.</div>
                    </form>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shipping Estimate Modal */}
          <AnimatePresence>
            {showShippingModal && (
              <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial="hidden" animate="visible" exit="exit" variants={simpleVariants}>
                <motion.div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full relative" initial="hidden" animate="visible" exit="exit" variants={simpleVariants}>
                  <button onClick={() => { setShowShippingModal(false); setShippingForm({ destination: '', zip: '' }); setShippingEstimate(null); }} className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl">&times;</button>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Shipping Estimate Calculator</h3>
                  <div className="mb-2 text-sm text-gray-500 font-semibold">From: San Diego, CA</div>
                  <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShippingEstimate(`Estimated shipping from San Diego: $${(Math.random() * 1000 + 800).toFixed(2)}`); }}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Destination Country/State</label>
                      <input type="text" className="w-full border rounded-md px-3 py-2" required value={shippingForm.destination} onChange={e => setShippingForm(f => ({ ...f, destination: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal Code</label>
                      <input type="text" className="w-full border rounded-md px-3 py-2" required value={shippingForm.zip} onChange={e => setShippingForm(f => ({ ...f, zip: e.target.value }))} />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Get Estimate</button>
                  </form>
                  {shippingEstimate && <div className="mt-4 text-lg text-green-600 font-semibold animate-fadeIn">{shippingEstimate}</div>}
                  <div className="text-xs text-gray-500 mt-4">For a precise quote, please contact us directly.</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vehicle Inspection Modal */}
          {showInspectionModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full relative">
                <button onClick={() => setShowInspectionModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl">&times;</button>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">What's Included in Our Inspection?</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                  <li>Comprehensive multi-point inspection</li>
                  <li>Battery & electrical system check (for EVs/Teslas)</li>
                  <li>Engine & transmission diagnostics</li>
                  <li>Brake, tire, and suspension review</li>
                  <li>Interior & exterior condition assessment</li>
                  <li>Vehicle history report</li>
                  <li>Test drive & performance evaluation</li>
                </ul>
                <div className="text-xs text-gray-500">Have more questions? <a href="/contact" className="text-blue-600 underline">Contact us</a> for details or a sample report.</div>
              </div>
            </div>
          )}

          {/* Crypto Calculator Modal */}
          {showCryptoModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full relative animate-slideUp">
                <button onClick={() => setShowCryptoModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl">&times;</button>
                <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">Crypto Calculator <FaBitcoin className="text-yellow-500 animate-spin-slow" /></h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">USD Amount</label>
                    <input type="number" className="w-full border rounded-md px-3 py-2" value={usdAmount} onChange={e => setUsdAmount(e.target.value)} min="0" />
                  </div>
                </form>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-lg"><FaBitcoin className="text-yellow-500" /> BTC: <span className="font-mono">{cryptoRates.btc && usdAmount ? (Number(usdAmount) / cryptoRates.btc).toFixed(6) : '--'}</span></div>
                  <div className="flex items-center gap-2 text-lg"><FaEthereum className="text-purple-500" /> ETH: <span className="font-mono">{cryptoRates.eth && usdAmount ? (Number(usdAmount) / cryptoRates.eth).toFixed(6) : '--'}</span></div>
                  <div className="flex items-center gap-2 text-lg"><SiSolana className="text-blue-500" /> SOL: <span className="font-mono">{cryptoRates.sol && usdAmount ? (Number(usdAmount) / cryptoRates.sol).toFixed(6) : '--'}</span></div>
                </div>
                <div className="text-xs text-gray-500 mt-4">Rates powered by CoinGecko. For large transactions, contact us for a custom quote.</div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </PageLoader>
  )
} 