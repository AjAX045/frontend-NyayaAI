'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Mic, 
  BookOpen, 
  Scale, 
  Gavel,
  AlertTriangle,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  Volume2,
  Eye,
  Download,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface LegalSection {
  id: string
  sectionNumber: string
  title: string
  description: string
  punishment: string
  category: string
  severity: 'low' | 'medium' | 'high'
  bailable: boolean
  relatedSections: string[]
  lastUpdated: string
  views: number
  rating: number
}

const legalSections: LegalSection[] = [
  {
    id: '1',
    sectionNumber: 'Section 376',
    title: 'Punishment for rape',
    description: 'Rigorous imprisonment for not less than seven years but which may extend to imprisonment for life, and shall also be liable to fine. In cases where the victim is a minor, the punishment may extend to death.',
    punishment: '7 years to life imprisonment + fine (Death penalty for minor victims)',
    category: 'Offense against Women',
    severity: 'high',
    bailable: false,
    relatedSections: ['Section 376A', 'Section 376B', 'Section 376D'],
    lastUpdated: '2023-12-15',
    views: 15420,
    rating: 4.8
  },
  {
    id: '2',
    sectionNumber: 'Section 420',
    title: 'Cheating and dishonestly inducing delivery of property',
    description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security.',
    punishment: 'Imprisonment up to 7 years + fine',
    category: 'Fraud',
    severity: 'medium',
    bailable: true,
    relatedSections: ['Section 415', 'Section 417', 'Section 418'],
    lastUpdated: '2023-11-20',
    views: 12350,
    rating: 4.5
  },
  {
    id: '3',
    sectionNumber: 'Section 302',
    title: 'Punishment for murder',
    description: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    punishment: 'Death penalty or life imprisonment + fine',
    category: 'Homicide',
    severity: 'high',
    bailable: false,
    relatedSections: ['Section 299', 'Section 304', 'Section 306'],
    lastUpdated: '2023-10-10',
    views: 18900,
    rating: 4.9
  },
  {
    id: '4',
    sectionNumber: 'Section 354',
    title: 'Assault or criminal force to woman with intent to outrage her modesty',
    description: 'Any man who assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty.',
    punishment: '1-5 years imprisonment + fine',
    category: 'Offense against Women',
    severity: 'medium',
    bailable: false,
    relatedSections: ['Section 354A', 'Section 354B', 'Section 354C'],
    lastUpdated: '2023-12-01',
    views: 22100,
    rating: 4.7
  },
  {
    id: '5',
    sectionNumber: 'Section 506',
    title: 'Punishment for criminal intimidation',
    description: 'Whoever commits the offense of criminal intimidation shall be punished with imprisonment for either description for a term which may extend to two years, or with fine, or with both.',
    punishment: 'Up to 2 years imprisonment + fine',
    category: 'Intimidation',
    severity: 'low',
    bailable: true,
    relatedSections: ['Section 503', 'Section 504', 'Section 505'],
    lastUpdated: '2023-09-15',
    views: 8900,
    rating: 4.3
  }
]

const categories = [
  'All Categories',
  'Offense against Women',
  'Fraud',
  'Homicide',
  'Intimidation',
  'Property Offense',
  'Cyber Crime',
  'Domestic Violence'
]

const severities = [
  { value: 'all', label: 'All Severities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [filteredSections, setFilteredSections] = useState<LegalSection[]>(legalSections)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    filterSections()
  }, [searchQuery, selectedCategory, selectedSeverity])

  const filterSections = () => {
    let filtered = legalSections

    if (searchQuery) {
      filtered = filtered.filter(section =>
        section.sectionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(section => section.category === selectedCategory)
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(section => section.severity === selectedSeverity)
    }

    setFilteredSections(filtered)
  }

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-IN'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Section Search</h1>
              <p className="text-gray-600">Search by section number or offense name</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by section number or offense name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-12 h-12 text-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={handleVoiceSearch}
                  disabled={isListening}
                >
                  {isListening ? (
                    <div className="h-4 w-4 animate-pulse bg-red-500 rounded-full" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-64 bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-gray-900">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-gray-900 focus:bg-gray-100">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-full lg:w-48 bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-gray-900">
                  {severities.map((severity) => (
                    <SelectItem key={severity.value} value={severity.value} className="text-gray-900 focus:bg-gray-100">
                      {severity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={() => setIsLoading(true)} className="hover-lift">
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600 mb-1">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Found {filteredSections.length} sections
            </h2>
            <p className="text-gray-600">
              {searchQuery && `Showing results for "${searchQuery}"`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-32 bg-white border-gray-300 text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 text-gray-900">
                <SelectItem value="relevance" className="text-gray-900 focus:bg-gray-100">Relevance</SelectItem>
                <SelectItem value="section" className="text-gray-900 focus:bg-gray-100">Section</SelectItem>
                <SelectItem value="views" className="text-gray-900 focus:bg-gray-100">Views</SelectItem>
                <SelectItem value="rating" className="text-gray-900 focus:bg-gray-100">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredSections.map((section) => (
            <Card key={section.id} className="hover-lift">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-primary">{section.sectionNumber}</h3>
                      <Badge className={getSeverityColor(section.severity)}>
                        {section.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {section.bailable ? 'Bailable' : 'Non-Bailable'}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{section.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {section.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center">
                        {renderStars(section.rating)}
                        {section.rating}
                      </span>
                      <span>Updated: {section.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Collapsible
                  open={expandedSections.includes(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                      <span className="text-sm text-gray-600">
                        {expandedSections.includes(section.id) ? 'Show less' : 'Show more'}
                      </span>
                      {expandedSections.includes(section.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-gray-700 leading-relaxed">{section.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Punishment</h4>
                      <p className="text-gray-700 bg-red-50 p-3 rounded-lg border border-red-200">
                        {section.punishment}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Category</h4>
                        <Badge variant="secondary">{section.category}</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Related Sections</h4>
                        <div className="flex flex-wrap gap-2">
                          {section.relatedSections.map((related, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {related}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Read More
                        </Button>
                        <Button variant="outline" size="sm">
                          <Gavel className="h-4 w-4 mr-2" />
                          Case Laws
                        </Button>
                      </div>
                      <Button size="sm">
                        View Details
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredSections.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sections found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All Categories')
                setSelectedSeverity('all')
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {filteredSections.length > 0 && filteredSections.length >= 5 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Sections
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}