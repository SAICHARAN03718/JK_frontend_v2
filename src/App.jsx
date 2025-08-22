import React, { useState, useCallback } from 'react'

// Import pages
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import SearchResults from './pages/SearchResults'
import GenerateBill from './pages/GenerateBill'
import BillSent from './pages/BillSent'
import BulkBilling from './pages/BulkBilling'
import ClientManagement from './pages/ClientManagement'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  // Track which section of Dashboard to show when navigating back (dashboard | lr-section | completed)
  const [dashboardRoute, setDashboardRoute] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedConsignment, setSelectedConsignment] = useState(null)
  const [billContext, setBillContext] = useState(null)

  // Use useCallback to ensure stable function references
  const navigateToHome = useCallback(() => {
    console.log('Navigating to home')
    setCurrentPage('home')
    // Clear search data when going home
    setSearchTerm('')
    setSearchResults([])
    setSelectedConsignment(null)
  }, [])
  
  const navigateToLanding = useCallback(() => {
    console.log('Navigating to landing')
    setCurrentPage('landing')
  }, [])
  
  const navigateToDashboard = useCallback((routeId = 'dashboard') => {
    console.log('Navigating to dashboard', routeId)
    setBillContext(null) // Clear any bill context when returning to dashboard
    setDashboardRoute(routeId)
    setCurrentPage('dashboard')
  }, [])
  
  // Enhanced search navigation with search term and results
  const navigateToSearch = useCallback((term = '', results = []) => {
    console.log('Navigating to search with term:', term, 'results:', results.length)
    setSearchTerm(term)
    setSearchResults(results)
    setCurrentPage('search')
  }, [])
  
  // Enhanced generate bill navigation with consignment data
  const navigateToGenerateBill = useCallback((consignmentData = null) => {
    console.log('Navigating to generate-bill with data:', consignmentData?.lrNumber)
    setSelectedConsignment(consignmentData)
    setCurrentPage('generate-bill')
  }, [])
  
  const navigateToBillSent = useCallback((context = null) => {
    console.log('Navigating to bill-sent')
    setBillContext(context)
    setCurrentPage('bill-sent')
  }, [])

  const navigateToBulkBilling = useCallback(() => {
    console.log('Navigating to bulk-billing')
    setCurrentPage('bulk-billing')
  }, [])

  const navigateToClientManagement = useCallback(() => {
    console.log('Navigating to client-management')
    setCurrentPage('client-management')
  }, [])

  // Debug logging
  console.log('App render - currentPage:', currentPage)
  console.log('Search term:', searchTerm, 'Search results:', searchResults?.length)

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onNavigateToLanding={navigateToLanding} 
            onNavigateToDashboard={navigateToDashboard}
          />
        )
      
      case 'landing':
        return (
          <LandingPage onNavigateToHome={navigateToHome} onNavigateToDashboard={navigateToDashboard} />
        )
      
  case 'dashboard':
        return (
          <Dashboard 
            onNavigateToHome={navigateToHome}
            onNavigateToSearch={navigateToSearch}
            onNavigateToGenerateBill={navigateToGenerateBill}
            onNavigateToBulkBilling={navigateToBulkBilling}
            onNavigateToClientManagement={navigateToClientManagement}
    initialRoute={dashboardRoute}
          />
        )
      
  case 'generate-bill':
        return (
          <GenerateBill 
            onNavigateToDashboard={navigateToDashboard}
            onNavigateToBillSent={context => navigateToBillSent(context)}
            consignmentData={selectedConsignment}
          />
        )
      
      case 'bulk-billing':
        return (
          <BulkBilling 
            onNavigateToDashboard={navigateToDashboard}
            onNavigateToBillSent={context => navigateToBillSent(context)}
    onNavigateToSearch={navigateToSearch}
    onNavigateToClientManagement={navigateToClientManagement}
          />
        )
      
      case 'bill-sent':
        return (
          <BillSent 
            onNavigateToDashboard={navigateToDashboard}
            billContext={billContext}
          />
        )
      
  case 'search':
        return (
          <SearchResults 
    searchTerm={searchTerm}
    searchResults={searchResults || []}
            onNavigateToDashboard={navigateToDashboard}
            onNavigateToGenerateBill={navigateToGenerateBill}
          />
        )
      
      case 'client-management':
        return (
          <ClientManagement 
            onNavigateToDashboard={navigateToDashboard}
            onNavigateToSearch={navigateToSearch}
            onNavigateToBulkBilling={navigateToBulkBilling}
          />
        )
      
      default:
        return (
          <LandingPage onNavigateToHome={navigateToHome} />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {renderCurrentPage()}
    </div>
  )
}

export default App