'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Menu, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showPoliceWarning, setShowPoliceWarning] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const pathname = usePathname()
  const hideCitizenLinks = pathname.startsWith('/police')

  const navRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({})

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Public Awareness', href: '/awareness' },
    { name: 'Search Sections', href: '/search' },
    { name: 'FAQs', href: '/faqs' },
  ]

  useEffect(() => {
    const updateIndicator = () => {
      const activeItem = navItems.find(item => item.href === pathname)
      if (activeItem && navRefs.current[activeItem.href]) {
        const element = navRefs.current[activeItem.href]
        if (element) {
          const { offsetLeft, offsetWidth } = element
          setIndicatorStyle({
            left: offsetLeft,
            width: offsetWidth,
            opacity: 1
          })
        }
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
      }
    }

    updateIndicator()
    
    // Add a small delay to ensure the DOM is updated
    const timeoutId = setTimeout(updateIndicator, 100)
    
    // Handle window resize
    window.addEventListener('resize', updateIndicator)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updateIndicator)
    }
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePolicePortalClick = (e) => {
    e.preventDefault()
    setShowPoliceWarning(true)
  }
  
  const proceedToPolicePortal = () => {
    setShowPoliceWarning(false)
    window.location.href = '/police/login'
  }

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nyaya AI</h1>
                <p className="text-xs text-gray-600">Intelligent FIR Assistance System</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 relative">
              {!hideCitizenLinks && navItems.map((item) => (
                <Link
                  key={item.name}
                  ref={(el) => { navRefs.current[item.href] = el }}
                  href={item.href}
                  className={`text-gray-700 hover:text-blue-600 transition-colors font-medium relative py-5 ${
                    pathname === item.href ? 'text-blue-600' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Animated Indicator */}
              {!hideCitizenLinks && (
                <div 
                  className="absolute bottom-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-300 ease-out shadow-lg"
                  style={{
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`,
                    opacity: indicatorStyle.opacity
                  }}
                />
              )}
            </nav>


            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex"
                onClick={handlePolicePortalClick}
              >
                Police Portal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {!hideCitizenLinks && navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium ${
                  pathname === item.href ? 'text-blue-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Police Portal button stays visible */}
            <button
              className="block py-2 text-blue-600 font-medium text-left w-full"
              onClick={(e) => {
                e.preventDefault()
                setIsMenuOpen(false)
                handlePolicePortalClick(e)
              }}
            >
              Police Portal
            </button>
          </nav>
        </div>
      )}

      </header>

      {/* Police Portal Warning Dialog */}
      <Dialog open={showPoliceWarning} onOpenChange={setShowPoliceWarning}>
        <DialogContent className="max-w-md bg-white border border-gray-200 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <DialogTitle className="text-xl">Police Portal Access</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 text-base">
              This portal is restricted to <strong>authorized police personnel only</strong>. 
              Normal citizens are not permitted to access this system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">⚠️ Important Notice:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Unauthorized access is prohibited by law</li>
                <li>• All access attempts are logged and monitored</li>
                <li>• Violators may face legal consequences</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <strong>Citizens:</strong> Please use the Public Awareness section for legal information and resources.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowPoliceWarning(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={proceedToPolicePortal}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              I Am Police Personnel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}