import React, { useState, useCallback } from 'react'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import SearchResults from './pages/SearchResults'
import GenerateBill from './pages/GenerateBill'
import BillSent from './pages/BillSent'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedConsignment, setSelectedConsignment] = useState(null)

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
  
  const navigateToDashboard = useCallback(() => {
    console.log('Navigating to dashboard')
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
  
  const navigateToBillSent = useCallback((billData = null) => {
    console.log('Navigating to bill-sent')
    setCurrentPage('bill-sent')
  }, [])

  // Debug logging
  console.log('App render - currentPage:', currentPage)
  console.log('Search term:', searchTerm, 'Search results:', searchResults?.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100 overflow-x-hidden">
      {currentPage === 'home' && (
        <HomePage 
          onNavigateToLanding={navigateToLanding} 
          onNavigateToDashboard={navigateToDashboard}
        />
      )}
      {currentPage === 'landing' && (
        <LandingPage onNavigateToHome={navigateToHome} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard 
          onNavigateToHome={navigateToHome}
          onNavigateToSearch={navigateToSearch}
        />
      )}
      {currentPage === 'search' && (
        <SearchResults 
          onNavigateToDashboard={navigateToDashboard}
          onNavigateToGenerateBill={navigateToGenerateBill}
          searchTerm={searchTerm}
          searchResults={searchResults}
        />
      )}
      {currentPage === 'generate-bill' && (
        <GenerateBill 
          onNavigateToDashboard={navigateToDashboard}
          onNavigateToBillSent={navigateToBillSent}
          consignmentData={selectedConsignment}
        />
      )}
      {currentPage === 'bill-sent' && (
        <BillSent 
          onNavigateToDashboard={navigateToDashboard}
        />
      )}
    </div>
  )
}

export default App