'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Calendar,
  ArrowRight,
  Scale,
  Shield,
  Gavel,
  Heart,
  Users,
  Star,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Article {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  thumbnail: string
  featured: boolean
  views: number
  rating: number
}

const articles: Article[] = [
  {
    id: '1',
    title: 'Understanding Your Fundamental Rights',
    excerpt: 'A comprehensive guide to the fundamental rights guaranteed by the Constitution of India and how they protect you in daily life.',
    category: 'Rights',
    author: 'Advocate Rajesh Kumar',
    date: '2024-01-15',
    readTime: '8 min',
    thumbnail: 'rights',
    featured: true,
    views: 15420,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Step-by-Step Guide to Filing an FIR',
    excerpt: 'Learn the complete process of filing a First Information Report, what information to include, and your rights during the procedure.',
    category: 'FIR Process',
    author: 'Legal Expert Priya Sharma',
    date: '2024-01-14',
    readTime: '12 min',
    thumbnail: 'fir',
    featured: true,
    views: 22100,
    rating: 4.9
  },
  {
    id: '3',
    title: 'New BNS Changes You Need to Know',
    excerpt: 'Major updates in the Bharatiya Nyaya Sanhita that replace the IPC and how they affect criminal law proceedings.',
    category: 'BNS Updates',
    author: 'Law Analyst Amit Verma',
    date: '2024-01-13',
    readTime: '15 min',
    thumbnail: 'bns',
    featured: false,
    views: 18900,
    rating: 4.7
  },
  {
    id: '4',
    title: 'Women\'s Legal Rights and Protections',
    excerpt: 'Essential laws and legal protections specifically designed to safeguard women\'s rights and ensure their safety.',
    category: 'Rights',
    author: 'Women Rights Advocate Sneha Reddy',
    date: '2024-01-12',
    readTime: '10 min',
    thumbnail: 'women',
    featured: false,
    views: 25600,
    rating: 4.9
  },
  {
    id: '5',
    title: 'Digital Rights and Cyber Laws',
    excerpt: 'Understanding your rights in the digital age, including privacy, data protection, and cybercrime prevention.',
    category: 'Technology',
    author: 'Tech Lawyer Vikram Singh',
    date: '2024-01-11',
    readTime: '7 min',
    thumbnail: 'digital',
    featured: false,
    views: 12300,
    rating: 4.5
  },
  {
    id: '6',
    title: 'Legal Aid Services for Underprivileged',
    excerpt: 'How to access free legal aid services, eligibility criteria, and available support for those who cannot afford legal representation.',
    category: 'Legal Aid',
    author: 'Legal Aid Coordinator',
    date: '2024-01-10',
    readTime: '6 min',
    thumbnail: 'aid',
    featured: false,
    views: 8900,
    rating: 4.3
  }
]

const categories = [
  'All Categories',
  'Rights',
  'FIR Process',
  'BNS Updates',
  'Technology',
  'Legal Aid',
  'FAQs'
]

const featuredTopics = [
  {
    icon: <Scale className="h-6 w-6 text-blue-600" />,
    title: 'Constitutional Rights',
    description: 'Fundamental rights and duties of citizens',
    count: 24
  },
  {
    icon: <Gavel className="h-6 w-6 text-blue-600" />,
    title: 'Criminal Law',
    description: 'Understanding criminal offenses and procedures',
    count: 18
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-600" />,
    title: 'Women Protection',
    description: 'Laws protecting women\'s rights and safety',
    count: 15
  },
  {
    icon: <Heart className="h-6 w-6 text-blue-600" />,
    title: 'Family Law',
    description: 'Marriage, divorce, and child custody laws',
    count: 12
  }
]

export default function LegalRightsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [filteredArticles, setFilteredArticles] = useState(articles)

  const filterArticles = () => {
    let filtered = articles

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    setFilteredArticles(filtered)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Rights': return 'bg-blue-100 text-blue-800'
      case 'FIR Process': return 'bg-green-100 text-green-800'
      case 'BNS Updates': return 'bg-purple-100 text-purple-800'
      case 'Technology': return 'bg-orange-100 text-orange-800'
      case 'Legal Aid': return 'bg-red-100 text-red-800'
      case 'FAQs': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getThumbnailIcon = (type: string) => {
    switch (type) {
      case 'rights': return <Scale className="h-12 w-12 text-blue-600" />
      case 'fir': return <Gavel className="h-12 w-12 text-green-600" />
      case 'bns': return <BookOpen className="h-12 w-12 text-purple-600" />
      case 'women': return <Heart className="h-12 w-12 text-pink-600" />
      case 'digital': return <Shield className="h-12 w-12 text-orange-600" />
      case 'aid': return <Users className="h-12 w-12 text-red-600" />
      default: return <BookOpen className="h-12 w-12 text-gray-600" />
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
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Legal Rights Hub</h1>
                <p className="text-xs text-gray-600">Educational Resources</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors">Search</Link>
              <Link href="/rights" className="text-blue-600 font-medium">Articles</Link>
              <Link href="/faqs" className="text-gray-700 hover:text-blue-600 transition-colors">FAQs</Link>
            </nav>

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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              <Link href="/" className="block py-2 text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/search" className="block py-2 text-gray-700 hover:text-blue-600">Search</Link>
              <Link href="/rights" className="block py-2 text-blue-600 font-medium">Articles</Link>
              <Link href="/faqs" className="block py-2 text-gray-700 hover:text-blue-600">FAQs</Link>
            </nav>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Know Your Legal Rights</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access comprehensive legal information, understand your rights, and learn about the Indian legal system through our educational articles.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  filterArticles()
                }}
                className="pl-10 h-12"
              />
            </div>
            <Select value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value)
              filterArticles()
            }}>
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
          </div>
        </div>

        {/* Featured Topics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {topic.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{topic.description}</p>
                  <div className="text-blue-600 font-medium">
                    {topic.count} articles
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select defaultValue="latest">
                <SelectTrigger className="w-32 bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-gray-900">
                  <SelectItem value="latest" className="text-gray-900 focus:bg-gray-100">Latest</SelectItem>
                  <SelectItem value="popular" className="text-gray-900 focus:bg-gray-100">Popular</SelectItem>
                  <SelectItem value="rating" className="text-gray-900 focus:bg-gray-100">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getCategoryColor(article.category)}>
                      {article.category}
                    </Badge>
                    {article.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getThumbnailIcon(article.thumbnail)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(article.rating)}
                      <span className="text-sm text-gray-600 ml-1">{article.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">{article.views.toLocaleString()} views</span>
                  </div>

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
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Articles
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}