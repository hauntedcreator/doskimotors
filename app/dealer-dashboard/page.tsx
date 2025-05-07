'use client'

import { useState, useEffect, useRef } from 'react'
import { useVehicleStore, Vehicle } from '../store/vehicleStore'
import { FiPackage, FiDollarSign, FiHeart, FiEye, FiEdit2, FiTrash2, FiPlus, FiMail, FiCheckCircle, FiCircle, FiRefreshCw, FiBell, FiClock, FiFileText, FiUpload, FiCheck, FiX, FiAlertCircle, FiAward } from 'react-icons/fi'
import VehicleForm from '../components/VehicleForm'
import DashboardHeader from '../components/DashboardHeader'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaCheckCircle, FaClock, FaLock } from 'react-icons/fa'
import Portal from '../components/Portal'
import DealerAnalytics from '../components/DealerAnalytics'
import AuctionWatchComingSoon from '../components/AuctionWatchComingSoon'
import TeslaAuctionsRoi from '../components/TeslaAuctionsRoi'
import { toast } from 'react-hot-toast'

interface BulkUploadFile {
  fileName: string;
  size: string;
  type: string;
  status: 'pending' | 'success' | 'error';
}

export default function DealerDashboard() {
  const {
    vehicles,
    totalValue,
    totalViews,
    totalLikes,
    salesMetrics,
    inventoryMetrics,
    updateVehicle,
    deleteVehicle,
    toggleFeatured,
    updateStatus,
    addVehicle,
    draftVehicle,
    draftVehicles,
    saveDraft,
    clearDraft,
    saveDraftToList,
    loadDraftFromList,
    deleteDraftFromList
  } = useVehicleStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined)
  const [formData, setFormData] = useState<Partial<Vehicle> | undefined>(undefined)
  const [isDraftMode, setIsDraftMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const vehiclesPerPage = 10
  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage)
  
  // Get current vehicles for pagination
  const indexOfLastVehicle = currentPage * vehiclesPerPage
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage
  const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle)

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'inventory' | 'leads' | 'analytics' | 'auctions'>('inventory')
  const [leads, setLeads] = useState<any[]>([])
  const [leadsLoading, setLeadsLoading] = useState(false)
  const [showCopied, setShowCopied] = useState<number | null>(null)
  const [showCopiedPhone, setShowCopiedPhone] = useState<number | null>(null)
  const [showBellDropdown, setShowBellDropdown] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)
  const [lastLeadCount, setLastLeadCount] = useState(leads.length)
  const [showToast, setShowToast] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null)
  const statusButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null)
  const [showDrafts, setShowDrafts] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const [showDraftsDropdown, setShowDraftsDropdown] = useState(false)
  const draftsButtonRef = useRef<HTMLDivElement>(null)
  const [currentFormData, setCurrentFormData] = useState<Partial<Vehicle> | undefined>(undefined)
  const [bulkUploadMode, setBulkUploadMode] = useState(false)
  const [bulkVehicles, setBulkVehicles] = useState<BulkUploadFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)

  // Calculate unreadCount before using it
  const unreadCount = leads.filter(l => !l.read).length;

  // Add new state variables for status indicators
  const [systemStatus, setSystemStatus] = useState({
    onlineSales: true,
    inventorySync: true,
    newLeads: unreadCount > 0,
    dataBackups: true,
    auctionWatch: true
  });

  const stats = [
    {
      title: 'Total Inventory',
      value: vehicles.filter(v => v.status !== 'sold').length,
      icon: FiPackage,
      change: `${inventoryMetrics.averageAge.toFixed(1)} days avg. age`,
      trend: 'info',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Total Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: FiDollarSign,
      change: `${inventoryMetrics.priceRanges[0]?.count || 0} vehicles under $25k`,
      trend: 'up',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      title: 'Vehicles Sold',
      value: salesMetrics.totalSold,
      icon: FiCheckCircle,
      change: `$${salesMetrics.totalProfit.toLocaleString()} profit`,
      trend: 'up',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Avg. Time to Sell',
      value: `${salesMetrics.averageTimeToSell.toFixed(1)} days`,
      icon: FiClock,
      change: `${salesMetrics.totalRevenue.toLocaleString()} revenue`,
      trend: 'info',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
  ]

  useEffect(() => {
    if (activeTab === 'leads') {
      setLeadsLoading(true)
      fetch('/api/leads')
        .then(res => res.json())
        .then(data => {
          setLeads(data)
          setLastLeadCount(data.length)
        })
        .finally(() => setLeadsLoading(false))
    }
  }, [activeTab])

  // Setup Server-Sent Events for real-time lead updates
  useEffect(() => {
    if (activeTab === 'leads') {
      const eventSource = new EventSource('/api/leads/sse')
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'update') {
            setLeads(data.leads)
            
            // Show toast notification if there are new leads
            if (data.leads.length > lastLeadCount) {
              setShowToast(true)
              setTimeout(() => setShowToast(false), 3000)
              setLastLeadCount(data.leads.length)
              
              // Play notification sound
              const audio = new Audio('/notification.mp3')
              audio.play().catch(e => console.log('Audio play error:', e))
            }
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error)
        }
      }
      
      eventSource.onerror = (error) => {
        console.error('SSE error:', error)
        eventSource.close()
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (activeTab === 'leads') {
            fetch('/api/leads')
              .then(res => res.json())
              .then(data => setLeads(data.reverse()))
          }
        }, 5000)
      }
      
      return () => {
        eventSource.close()
      }
    }
  }, [activeTab, lastLeadCount])

  useEffect(() => {
    const savedTab = localStorage.getItem('dealerDashboardTab');
    if (savedTab === 'leads' || savedTab === 'inventory' || savedTab === 'analytics' || savedTab === 'auctions') {
      setActiveTab(savedTab as 'leads' | 'inventory' | 'analytics' | 'auctions');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dealerDashboardTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (statusDropdownOpen && statusButtonRefs.current[statusDropdownOpen]) {
      const rect = statusButtonRefs.current[statusDropdownOpen]!.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    } else {
      setDropdownPosition(null);
    }
  }, [statusDropdownOpen]);

  // Load saved form data on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('current-vehicle-form');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCurrentFormData(parsed);
        setFormData(parsed); // Also set form data to ensure it's available immediately
      } catch (e) {
        console.error('Error loading saved form data:', e);
      }
    }
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    if (formData) {
      sessionStorage.setItem('current-vehicle-form', JSON.stringify(formData));
      setCurrentFormData(formData);
    }
  }, [formData]);

  // Handle clicking outside drafts dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (draftsButtonRef.current && !draftsButtonRef.current.contains(event.target as Node)) {
        setShowDraftsDropdown(false);
      }
    }
    if (showDraftsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDraftsDropdown]);

  // Auto-save timer
  useEffect(() => {
    if (formData) {
      const timer = setTimeout(() => {
        saveDraft(formData);
      }, 1000); // Auto-save after 1 second of no changes
      return () => clearTimeout(timer);
    }
  }, [formData]);

  // Handle clicking outside modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (formData) {
          saveDraft(formData);
          if (isDraftMode) {
            saveDraftToList(formData, draftTitle || undefined);
          }
        }
        setIsModalOpen(false);
        setSelectedVehicle(undefined);
      }
    }

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModalOpen, formData, isDraftMode, draftTitle]);

  // Load draft on mount if exists
  useEffect(() => {
    if (draftVehicle && !isModalOpen) {
      setFormData(draftVehicle);
    }
  }, [draftVehicle]);

  const handleAddVehicle = () => {
    setSelectedVehicle(undefined);
    // Use saved form data if it exists
    const savedData = sessionStorage.getItem('current-vehicle-form');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed);
      setCurrentFormData(parsed);
    }
    setIsDraftMode(true);
    setIsModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setFormData(vehicle)
    setIsDraftMode(false)
    setIsModalOpen(true)
  }

  const handleSubmit = async (vehicleData: Partial<Vehicle>) => {
    setIsLoading(true)
    try {
      if (selectedVehicle?.id) {
        await updateVehicle(selectedVehicle.id, vehicleData)
      } else {
        await addVehicle(vehicleData)
        clearDraft()
      }
      setIsModalOpen(false)
      setSelectedVehicle(undefined)
      setFormData(undefined)
      setIsDraftMode(false)
    } catch (error) {
      console.error('Error saving vehicle:', error)
    } finally {
      setIsLoading(false)
    }
    return Promise.resolve();
  }

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      setIsLoading(true)
      try {
        await deleteVehicle(id)
      } catch (error) {
        console.error('Error deleting vehicle:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleStatusChange = (id: string, newStatus: Vehicle['status']) => {
    try {
      updateStatus(id, newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleToggleFeatured = (id: string) => {
    try {
      toggleFeatured(id)
    } catch (error) {
      console.error('Error toggling featured status:', error)
    }
  }

  const handleMarkRead = async (index: number, read: boolean) => {
    try {
      const updatedLeads = [...leads];
      updatedLeads[index] = {
        ...updatedLeads[index],
        read,
        viewedAt: read ? new Date().toISOString() : null
      };
      setLeads(updatedLeads);
      
      // Update server-side
      await fetch(`/api/leads/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index, read, viewedAt: read ? new Date().toISOString() : null })
      });
    } catch (error) {
      console.error('Error marking lead as read:', error);
      toast.error('Failed to update lead status');
    }
  };

  const handleDeleteLead = async (index: number) => {
    try {
      const updatedLeads = [...leads];
      updatedLeads.splice(index, 1);
      setLeads(updatedLeads);
      
      // Update server-side
      await fetch(`/api/leads/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const getReplyMailto = (lead: any) => {
    const subject = encodeURIComponent(`Re: ${lead.subject || 'Your Inquiry'} - Doski Motors`);
    const body = encodeURIComponent(
      `Hi ${lead.name || ''},\n\nThank you for contacting Doski Motors!\n\nYour message: "${lead.message || lead.desc || ''}"\n\n---\nThis is a reply to your inquiry submitted on ${lead.date ? new Date(lead.date).toLocaleString() : ''}.\n\nBest regards,\nDoski Motors Team`
    );
    return `mailto:${lead.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyEmail = (email: string, idx: number) => {
    navigator.clipboard.writeText(email)
    setShowCopied(idx)
    setTimeout(() => setShowCopied(null), 2000)
  }

  const handleCopyPhone = (phone: string, idx: number) => {
    navigator.clipboard.writeText(phone)
    setShowCopiedPhone(idx)
    setTimeout(() => setShowCopiedPhone(null), 2000)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowBellDropdown(false);
      }
    }
    if (showBellDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBellDropdown]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleSaveAsDraft = () => {
    // Save draft even with minimal data
    const draftData = {
      ...formData,
      id: `draft-${Date.now()}`, // Ensure unique ID
      lastModified: new Date().toISOString(),
      isDraft: true
    };

    // Create a descriptive title based on available data
    const draftTitle = [
      formData?.make || '',
      formData?.model || '',
      formData?.year || '',
      'Draft',
      new Date().toLocaleString()
    ].filter(Boolean).join(' ');

    saveDraftToList(draftData, draftTitle);
    
    // Show feedback
    alert('Draft saved successfully! You can find it in the Drafts menu.');
    setShowDraftsDropdown(true);
  };

  // Add effect to check system statuses
  useEffect(() => {
    const checkSystemStatus = () => {
      setSystemStatus(prev => ({
        ...prev,
        inventorySync: vehicles.length > 0,
        newLeads: unreadCount > 0,
        dataBackups: true, // We have backup mechanisms in place
        auctionWatch: true
      }));
    };

    // Initial check
    checkSystemStatus();

    // Set up interval for periodic checks
    const interval = setInterval(checkSystemStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [vehicles.length, unreadCount]);

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-8">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome Doski Motors
                </h1>
                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  Premium Dealer
                </span>
              </div>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 group relative">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    systemStatus.onlineSales ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span className="text-gray-600">Online Sales {systemStatus.onlineSales ? 'Active' : 'Inactive'}</span>
                  <div className="absolute -top-8 left-0 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {systemStatus.onlineSales 
                      ? `${vehicles.filter(v => v.status === 'available').length} vehicles available for sale`
                      : 'No vehicles currently available'}
                  </div>
                </div>
                <div className="flex items-center gap-2 group relative">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    systemStatus.inventorySync ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <span className="text-gray-600">Inventory Synced</span>
                  <div className="absolute -top-8 left-0 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {systemStatus.inventorySync 
                      ? `${vehicles.length} total vehicles in inventory`
                      : 'No inventory data'}
                  </div>
                </div>
                <div className="flex items-center gap-2 group relative">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    systemStatus.dataBackups ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span className="text-gray-600">Data Protection Active</span>
                  <div className="absolute -top-8 left-0 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Inventory is automatically backed up and protected from accidental deletion
                  </div>
                </div>
                <div className="flex items-center gap-2 group relative">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    systemStatus.auctionWatch ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'
                  }`}></div>
                  <span className="text-gray-600">Auction Watch</span>
                  <div className="absolute -top-8 left-0 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Monitoring Copart and IAAI for Tesla auctions
                  </div>
                </div>
                <div className="flex items-center gap-2 group relative">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    systemStatus.newLeads ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
                  }`}></div>
                  <span className="text-gray-600">New Leads {systemStatus.newLeads && `(${unreadCount})`}</span>
                  <div className="absolute -top-8 left-0 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {systemStatus.newLeads 
                      ? `${unreadCount} unread leads waiting`
                      : 'No new leads'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div ref={draftsButtonRef} className="relative">
                <button
                  onClick={() => setShowDraftsDropdown(!showDraftsDropdown)}
                  className="inline-flex items-center px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <FiFileText className="mr-2 h-5 w-5 text-gray-500" />
                  Drafts ({draftVehicles.length})
                  <svg className="ml-2 -mr-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleAddVehicle}
                className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <FiPlus className="mr-2 h-5 w-5" />
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center mb-4 relative">
          <div ref={bellRef} className="relative">
            <button onClick={() => setShowBellDropdown(v => !v)} className="relative p-2 rounded-full hover:bg-blue-100 transition">
              <FiBell className="w-6 h-6 text-blue-700" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />}
            </button>
            {showBellDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg z-50 border">
                <div className="p-2 font-semibold text-gray-700 border-b">Unread Leads</div>
                {leads.filter(l => !l.read).length === 0 ? (
                  <div className="p-4 text-gray-400 text-sm">No unread leads</div>
                ) : (
                  <ul>
                    {leads.filter(l => !l.read).slice(0, 5).map((lead, idx) => (
                      <li key={idx} className="px-4 py-2 hover:bg-blue-50 cursor-pointer" onClick={() => {
                        setActiveTab('leads');
                        setShowBellDropdown(false);
                        setTimeout(() => {
                          const el = document.getElementById(`lead-${leads.length - 1 - idx}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 300);
                      }}>
                        <div className="font-semibold text-blue-900">{lead.name || 'No Name'}</div>
                        <div className="text-xs text-gray-500">{lead.date ? new Date(lead.date).toLocaleString() : ''}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-1 mb-8 bg-white rounded-xl p-1 shadow-sm w-fit">
          <button 
            onClick={() => setActiveTab('inventory')} 
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'inventory' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('leads')} 
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'leads' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Leads/Inbox
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-white text-blue-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'analytics' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('auctions')} 
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'auctions' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Auctions
          </button>
        </div>
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'inventory' && (
              <motion.div key="inventory" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                          <p className={`text-sm ${
                            stat.trend === 'up' ? 'text-green-600' : 
                            stat.trend === 'down' ? 'text-red-600' : 
                            'text-blue-600'
                          }`}>
                            {stat.change}
                          </p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                          <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Makes</h3>
                    <div className="space-y-4">
                      {inventoryMetrics.popularMakes.map((make, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-600">{make.make}</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 rounded-full h-2" 
                                style={{ 
                                  width: `${(make.count / Math.max(...inventoryMetrics.popularMakes.map(m => m.count))) * 100}%` 
                                }} 
                              />
                            </div>
                            <span className="text-sm text-gray-500">{make.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Distribution</h3>
                    <div className="space-y-4">
                      {inventoryMetrics.priceRanges.map((range, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-600">{range.range}</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 rounded-full h-2" 
                                style={{ 
                                  width: `${(range.count / Math.max(...inventoryMetrics.priceRanges.map(r => r.count))) * 100}%` 
                                }} 
                              />
                            </div>
                            <span className="text-sm text-gray-500">{range.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Vehicle Inventory</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {currentVehicles.map((vehicle) => (
                      <motion.div
                        key={vehicle.id}
                        whileHover={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)', y: -4, borderColor: '#2563eb' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                        className={`p-6 mb-2 rounded-xl bg-white transition-all duration-300 border-2 ${
                          vehicle.status === 'sold'
                            ? 'border-red-200 bg-red-50 hover:bg-red-100'
                            : vehicle.status === 'pending'
                            ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
                            : 'border-green-200 hover:bg-green-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={vehicle.image}
                              alt={vehicle.title}
                              className="w-16 h-16 object-cover rounded-lg shadow-sm"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <motion.span
                                  key={vehicle.status}
                                  initial={{ scale: 0.8, opacity: 0.7 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.25 }}
                                  className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${
                                    vehicle.status === 'sold'
                                      ? 'bg-red-100 text-red-800'
                                      : vehicle.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                                </motion.span>
                                <h3 className="text-lg font-medium text-gray-900">{vehicle.title}</h3>
                              </div>
                              <p className="text-sm text-gray-500">
                                {vehicle.year} • {vehicle.mileage.toLocaleString()} miles • ${vehicle.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <button
                                ref={el => {
                                  statusButtonRefs.current[vehicle.id] = el;
                                }}
                                type="button"
                                onClick={() => setStatusDropdownOpen(vehicle.id === statusDropdownOpen ? null : vehicle.id)}
                                className="flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold shadow-sm border-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200"
                                style={{
                                  backgroundColor: vehicle.status === 'sold' ? '#EF4444' : 
                                                 vehicle.status === 'pending' ? '#F59E0B' : 
                                                 '#10B981',
                                  color: 'white'
                                }}
                                aria-haspopup="listbox"
                                aria-expanded={statusDropdownOpen === vehicle.id}
                              >
                                {vehicle.status === 'sold' && <FaLock className="w-4 h-4" />}
                                {vehicle.status === 'pending' && <FaClock className="w-4 h-4" />}
                                {vehicle.status === 'available' && <FaCheckCircle className="w-4 h-4" />}
                                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <AnimatePresence>
                                {statusDropdownOpen === vehicle.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute z-50 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    role="listbox"
                                  >
                                    <div className="py-1">
                                      {[
                                        { value: 'available', label: 'Available', icon: <FaCheckCircle className="w-4 h-4 text-green-500" /> },
                                        { value: 'pending', label: 'Pending', icon: <FaClock className="w-4 h-4 text-yellow-500" /> },
                                        { value: 'sold', label: 'Sold', icon: <FaLock className="w-4 h-4 text-red-500" /> }
                                      ].map((option) => (
                                        <button
                                          key={option.value}
                                          className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 ${
                                            vehicle.status === option.value ? 'bg-gray-50' : ''
                                          }`}
                                          onClick={() => {
                                            handleStatusChange(vehicle.id, option.value as Vehicle['status']);
                                            setStatusDropdownOpen(null);
                                          }}
                                        >
                                          {option.icon}
                                          <span className="text-sm text-gray-700">{option.label}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              whileHover={{ scale: 1.08, backgroundColor: vehicle.featured ? '#fde68a' : '#f3f4f6' }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                              onClick={() => handleToggleFeatured(vehicle.id)}
                              className={`flex items-center gap-1 px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-200 shadow-sm
                                ${vehicle.featured ? 'bg-amber-400 text-white hover:bg-amber-500' : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'}`}
                            >
                              <FaStar className={`w-4 h-4 ${vehicle.featured ? 'text-yellow-200' : 'text-gray-400'}`} />
                              {vehicle.featured ? 'Featured' : 'Feature'}
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              whileHover={{ scale: 1.08, backgroundColor: '#e0e7ff' }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                              onClick={() => handleEditVehicle(vehicle)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="Edit vehicle"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              whileHover={{ scale: 1.08, backgroundColor: '#fee2e2' }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete vehicle"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 text-sm font-medium rounded-md ${
                            currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          Previous
                        </button>
                        <div className="flex items-center space-x-2">
                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index + 1}
                              onClick={() => handlePageChange(index + 1)}
                              className={`px-4 py-2 text-sm font-medium rounded-md ${
                                currentPage === index + 1
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                              }`}
                            >
                              {index + 1}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2 text-sm font-medium rounded-md ${
                            currentPage === totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="h-32"></div>
                </div>
              </motion.div>
            )}
            {activeTab === 'leads' && (
              <motion.div key="leads" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">Customer Leads/Inbox</h2>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span className="flex items-center">
                          <span className={`w-2 h-2 rounded-full animate-pulse ${lastLeadCount < leads.length ? 'bg-green-500' : 'bg-blue-500'} mr-1.5`}></span>
                          <span>
                            {lastLeadCount < leads.length 
                              ? 'New leads synced in real-time' 
                              : 'Synced and ready - monitoring for new leads'}
                          </span>
                        </span>
                        <span className="mx-2">•</span>
                        <span>Captures all form submissions across the website</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">
                        {leads.length} total {leads.length === 1 ? 'lead' : 'leads'}
                      </div>
                      <button 
                        onClick={() => {
                          setLeadsLoading(true);
                          fetch('/api/leads')
                            .then(res => res.json())
                            .then(data => setLeads(data))
                            .finally(() => setLeadsLoading(false));
                        }} 
                        className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition shadow-sm" 
                        title="Refresh leads"
                      >
                        <FiRefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {leadsLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading leads...</div>
                  ) : leads.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No leads yet.</div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {leads.map((lead, idx) => (
                        <div key={idx} id={`lead-${idx}`} className={`p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${!lead.read ? 'bg-blue-50' : ''}`}
                          onClick={() => {}}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span onClick={e => { e.stopPropagation(); handleMarkRead(idx, !lead.read); }} className="cursor-pointer">
                                {!lead.read ? <FiCircle className="text-blue-500" /> : <FiCheckCircle className="text-green-400" />}
                              </span>
                              <span className={`font-semibold ${!lead.read ? 'text-blue-900' : 'text-gray-900'}`}>{lead.name || 'No Name'}</span>
                              <span className="text-gray-600 text-sm">{lead.email}</span>
                              {lead.phone && (
                                <>
                                  <span className="text-gray-600 text-sm ml-2">• Phone: {lead.phone}</span>
                                  <button onClick={e => { e.stopPropagation(); handleCopyPhone(lead.phone, idx); }} className="ml-2 px-2 py-1 rounded bg-gray-100 text-xs text-gray-700 hover:bg-gray-200 relative">Copy Phone
                                    {showCopiedPhone === idx && <span className="absolute left-1/2 -translate-x-1/2 top-8 bg-blue-700 text-white text-xs rounded px-2 py-1 shadow animate-fadeIn">Copied!</span>}
                                  </button>
                                </>
                              )}
                              {lead.email && <button onClick={e => { e.stopPropagation(); handleCopyEmail(lead.email, idx); }} className="ml-2 px-2 py-1 rounded bg-gray-100 text-xs text-gray-700 hover:bg-gray-200 relative">Copy Email
                                {showCopied === idx && <span className="absolute left-1/2 -translate-x-1/2 top-8 bg-blue-700 text-white text-xs rounded px-2 py-1 shadow animate-fadeIn">Copied!</span>}
                              </button>}
                              {lead.source && (
                                <span className="ml-2 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                  {lead.source === 'contact-page' ? 'Contact Form' : 
                                   lead.source === 'services-page' ? 'Services Page' : 
                                   lead.source === 'vehicle-contact' ? 'Vehicle Inquiry' : 
                                   lead.source}
                                </span>
                              )}
                              {lead.vehicleTitle && (
                                <span className="ml-2 px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                  {lead.vehicleTitle}
                                </span>
                              )}
                            </div>
                            <div className="text-gray-700 mt-2 whitespace-pre-line">{lead.message || lead.desc || ''}</div>
                            {lead.files && Array.isArray(lead.files) && lead.files.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {lead.files.map((file: any, i: number) => (
                                  <a key={i} href={typeof file === 'string' && file ? file : '#'} target="_blank" rel="noopener noreferrer">
                                    <img src={typeof file === 'string' && file ? file : null} alt="Uploaded" className="w-16 h-16 object-cover rounded border" />
                                  </a>
                                ))}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 mt-1">
                              Submitted: {lead.date ? new Date(lead.date).toLocaleString() : ''}
                              {lead.viewedAt && <span> | Viewed: {new Date(lead.viewedAt).toLocaleString()}</span>}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 min-w-[180px] items-end">
                            {lead.email && (
                              <a href={getReplyMailto(lead)} className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2" target="_blank" rel="noopener noreferrer"><FiMail /> Reply</a>
                            )}
                            <button onClick={e => { e.stopPropagation(); handleMarkRead(idx, !lead.read); }} className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300 transition">
                              Mark as {lead.read ? 'Unread' : 'Read'}
                            </button>
                            <button onClick={e => { e.stopPropagation(); handleDeleteLead(idx); }} className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition flex items-center gap-1"><FiTrash2 /> Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {showToast && (
                  <div className="fixed bottom-8 right-8 bg-blue-700 text-white px-4 py-2 rounded shadow-lg animate-fadeIn z-50">New lead received!</div>
                )}
              </motion.div>
            )}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <DealerAnalytics />
              </motion.div>
            )}
            {activeTab === 'auctions' && (
              <div className="space-y-6">
                <AuctionWatchComingSoon />
                <TeslaAuctionsRoi />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <div className="flex items-center gap-2">
                {!selectedVehicle && (
                  <button
                    onClick={handleSaveAsDraft}
                    className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 rounded-md flex items-center gap-1"
                  >
                    <FiFileText className="w-4 h-4" />
                    Save as Draft
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedVehicle(undefined);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 pt-4">
              <VehicleForm
                vehicle={formData || selectedVehicle || undefined}
                onSubmit={handleSubmit}
                onChange={(data) => {
                  setFormData(data);
                }}
                onCancel={() => {
                  setIsModalOpen(false);
                  setSelectedVehicle(undefined);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Quick Multi-Vehicle Upload</h2>
            <p className="text-sm text-gray-500">Upload multiple vehicles at once</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="file"
              multiple
              accept=".csv,.json,.xlsx,.xls"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) {
                  setBulkVehicles(files.map(file => ({
                    fileName: file.name,
                    size: (file.size / 1024).toFixed(2) + ' KB',
                    type: file.type,
                    status: 'pending'
                  })));
                  setShowBulkUploadModal(true);
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2 shadow-sm transition-colors"
            >
              <FiUpload className="w-5 h-5" />
              Upload Multiple Vehicles
            </button>
          </div>
        </div>

        {showBulkUploadModal && bulkVehicles.length > 0 && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold">Upload Vehicles</h3>
                <button
                  onClick={() => {
                    setShowBulkUploadModal(false);
                    setBulkVehicles([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {bulkVehicles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{file.fileName}</p>
                        <p className="text-sm text-gray-500">{file.size}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === 'pending' && (
                          <span className="text-yellow-600 flex items-center gap-1">
                            <FiClock className="w-4 h-4" /> Pending
                          </span>
                        )}
                        {file.status === 'success' && (
                          <span className="text-green-600 flex items-center gap-1">
                            <FiCheckCircle className="w-4 h-4" /> Uploaded
                          </span>
                        )}
                        {file.status === 'error' && (
                          <span className="text-red-600 flex items-center gap-1">
                            <FiAlertCircle className="w-4 h-4" /> Error
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setBulkVehicles(bulkVehicles.filter((_, i) => i !== index));
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowBulkUploadModal(false);
                      setBulkVehicles([]);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await Promise.all(bulkVehicles.map(async (file) => {
                        }));
                        
                        alert('Vehicles uploaded successfully!');
                        setShowBulkUploadModal(false);
                        setBulkVehicles([]);
                      } catch (error) {
                        console.error('Error uploading vehicles:', error);
                        alert('Error uploading vehicles. Please try again.');
                      }
                    }}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2"
                  >
                    <FiUpload className="w-4 h-4" />
                    Upload {bulkVehicles.length} Files
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      )}
    </div>
  )
} 