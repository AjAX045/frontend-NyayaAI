'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Shield, 
  BookOpen, 
  Search, 
  FileText, 
  HelpCircle,
  ArrowRight,
  Menu,
  X,
  Users,
  Scale,
  Gavel,
  Heart,
  Brain,
  Check,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPoliceWarning, setShowPoliceWarning] = useState(false)

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

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Public Awareness', href: '/awareness' },
    { name: 'Search Sections', href: '/search' },
    { name: 'FAQs', href: '/faqs' },
  ]

  const features = [
    {
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      title: 'Public Awareness',
      description: 'Legal awareness campaigns, safety initiatives, and citizen education programs',
      href: '/awareness'
    },
    {
      icon: <Scale className="h-8 w-8 text-blue-600" />,
      title: 'Understand BNS',
      description: 'Learn about the new Bharatiya Nyaya Sanhita and its provisions',
      href: '/bns'
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: 'How to File FIR',
      description: 'Step-by-step guide to filing First Information Reports effectively',
      href: '/fir-guide'
    }
  ]

  const stats = [
    { label: 'Legal Sections', value: '500+', icon: <Gavel className="h-5 w-5" /> },
    { label: 'Articles', value: '100+', icon: <BookOpen className="h-5 w-5" /> },
    { label: 'Users Helped', value: '10K+', icon: <Users className="h-5 w-5" /> },
    { label: 'Success Rate', value: '98%', icon: <Heart className="h-5 w-5" /> }
  ]

  const recentArticles = [
    {
      title: 'Understanding Digital Rights in India',
      excerpt: 'A comprehensive guide to your rights in the digital age...',
      category: 'Technology',
      readTime: '5 min',
      date: '2024-01-15'
    },
    {
      title: 'Women\'s Safety Laws You Should Know',
      excerpt: 'Essential legal protections for women under Indian law...',
      category: 'Women Rights',
      readTime: '8 min',
      date: '2024-01-14'
    },
    {
      title: 'New BNS Changes Explained',
      excerpt: 'Major changes in the new criminal law framework...',
      category: 'Legal Updates',
      readTime: '10 min',
      date: '2024-01-13'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
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
                <h1 className="text-xl font-bold text-gray-900">Smart FIR</h1>
                <p className="text-xs text-gray-600">Legal Awareness</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
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
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
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

      {/* Hero Section with Search */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="container mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🇮🇳 Empowering Indian Citizens
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Empowering Citizens with
              <span className="text-blue-600"> Legal Awareness</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Learn your rights and understand the new BNS laws. Access comprehensive legal information, 
              file FIRs effectively, and stay informed about your legal protections.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-100">
                <div className="flex items-center">
                  <div className="flex-1 flex items-center">
                    <Search className="h-5 w-5 text-gray-400 ml-4 mr-3" />
                    <Input
                      placeholder="Search for legal sections, rights, FIR procedures, or any legal topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 focus:ring-0 text-lg py-3 px-0"
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl m-1 px-6 py-3">
                    Search
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="text-sm text-gray-500">Popular:</span>
                {['Section 420', 'Domestic Violence', 'Property Rights', 'Cyber Crime'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Articles & Updates
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay informed with our latest legal insights and updates
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {recentArticles.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow group cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {article.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{article.date}</span>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600">
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/awareness">
              <Button variant="outline" size="lg">
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Know Your Rights?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of citizens who are empowered with legal knowledge
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/awareness">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/faqs">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Browse FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">Smart FIR</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering citizens with legal awareness and accessible justice.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/awareness" className="hover:text-white">Public Awareness</Link></li>
                <li><Link href="/search" className="hover:text-white">Search Sections</Link></li>
                <li><Link href="/faqs" className="hover:text-white">FAQs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/fir-guide" className="hover:text-white">FIR Guide</Link></li>
                <li><Link href="/bns" className="hover:text-white">BNS Overview</Link></li>
                <li><Link href="/legal-aid" className="hover:text-white">Legal Aid</Link></li>
                <li><Link href="/emergency" className="hover:text-white">Emergency Contacts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📞 Emergency: 112</li>
                <li>📞 Police Helpline: 100</li>
                <li>📧 Legal Aid: 1516</li>
                <li>🌐 www.smartfir.gov.in</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">
                <strong>Disclaimer:</strong> This is an awareness platform. FIRs can be filed only by authorized officers.
              </p>
              <p className="text-gray-500 text-xs">
                © 2024 Smart FIR System. All rights reserved. | Privacy Policy | Terms of Service
              </p>
            </div>
          </div>
        </div>
      </footer>

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
    </div>
  )
}