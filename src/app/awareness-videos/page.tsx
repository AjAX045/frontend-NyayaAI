'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Play, 
  Clock, 
  Eye, 
  Filter,
  ArrowRight,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
  Calendar,
  User,
  Download
} from 'lucide-react'

export default function AwarenessVideosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedVideo, setSelectedVideo] = useState(null)

  const videos = [
    {
      id: 1,
      title: "How to File an FIR: Complete Step-by-Step Guide",
      description: "Learn the complete process of filing an FIR with detailed explanations and practical demonstrations.",
      thumbnail: "📹",
      duration: "12:45",
      category: "Legal Procedures",
      date: "2024-01-18",
      author: "Legal Department",
      views: 15420,
      likes: 892,
      comments: 67,
      featured: true,
      tags: ["FIR", "legal", "procedure", "guide"],
      videoUrl: "#",
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "Cyber Safety: Protect Yourself from Online Fraud",
      description: "Essential tips and techniques to stay safe online and avoid common cyber fraud schemes.",
      thumbnail: "🔐",
      duration: "8:30",
      category: "Cyber Safety",
      date: "2024-01-15",
      author: "Cyber Cell",
      views: 12300,
      likes: 756,
      comments: 45,
      featured: true,
      tags: ["cyber", "safety", "fraud", "protection"],
      videoUrl: "#",
      downloadUrl: "#"
    },
    {
      id: 3,
      title: "Women's Safety: Know Your Rights",
      description: "Comprehensive guide to women's legal rights and safety measures in various situations.",
      thumbnail: "🛡️",
      duration: "15:20",
      category: "Women's Safety",
      date: "2024-01-12",
      author: "Women's Cell",
      views: 18900,
      likes: 1200,
      comments: 89,
      featured: true,
      tags: ["women", "safety", "rights", "protection"],
      videoUrl: "#",
      downloadUrl: "#"
    },
    {
      id: 4,
      title: "Traffic Rules and Violations: What You Need to Know",
      description: "Understanding traffic laws, common violations, and their consequences.",
      thumbnail: "🚦",
      duration: "10:15",
      category: "Traffic Safety",
      date: "2024-01-10",
      author: "Traffic Department",
      views: 8900,
      likes: 445,
      comments: 23,
      featured: false,
      tags: ["traffic", "rules", "violations", "safety"],
      videoUrl: "#",
      downloadUrl: "#"
    },
    {
      id: 5,
      title: "Child Protection Laws and Safety Measures",
      description: "Important information about child protection laws and how to keep children safe.",
      thumbnail: "👶",
      duration: "18:00",
      category: "Child Safety",
      date: "2024-01-08",
      author: "Child Protection Unit",
      views: 7600,
      likes: 389,
      comments: 31,
      featured: false,
      tags: ["child", "protection", "safety", "laws"],
      videoUrl: "#",
      downloadUrl: "#"
    },
    {
      id: 6,
      title: "Domestic Violence: Legal Recourse and Support",
      description: "Understanding domestic violence laws and available support systems.",
      thumbnail: "🏠",
      duration: "14:30",
      category: "Social Awareness",
      date: "2024-01-05",
      author: "Social Welfare",
      views: 9200,
      likes: 567,
      comments: 42,
      featured: false,
      tags: ["domestic", "violence", "support", "legal"],
      videoUrl: "#",
      downloadUrl: "#"
    },
    {
      id: 7,
      title: "Emergency Helplines: When and How to Call",
      description: "Complete guide to emergency helplines and proper procedures during emergencies.",
      thumbnail: "📞",
      duration: "6:45",
      category: "Emergency",
      date: "2024-01-03",
      author: "Emergency Services",
      views: 11200,
      likes: 678,
      comments: 34,
      featured: false,
      tags: ["emergency", "helpline", "procedures", "help"],
      videoUrl: "#",
      downloadUrl: "#"
    },
    {
      id: 8,
      title: "Community Policing: Building Safer Neighborhoods",
      description: "How community policing works and how citizens can participate in creating safer communities.",
      thumbnail: "🤝",
      duration: "11:20",
      category: "Community",
      date: "2024-01-01",
      author: "Community Relations",
      views: 6800,
      likes: 334,
      comments: 28,
      featured: false,
      tags: ["community", "policing", "safety", "participation"],
      videoUrl: "#",
      downloadUrl: "#"
    }
  ]

  const categories = ['all', 'Legal Procedures', 'Cyber Safety', 'Women\'s Safety', 'Traffic Safety', 'Child Safety', 'Social Awareness', 'Emergency', 'Community']

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredVideos = videos.filter(video => video.featured)

  const formatDuration = (duration) => {
    return duration
  }

  const formatViews = (views) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K'
    }
    return views.toString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{
                animation: 'fadeInSlideUp 1.2s ease-out forwards',
                opacity: 0,
                transform: 'translateY(30px)'
              }}
            >
              Awareness Videos
            </h1>
            
            <style jsx>{`
              @keyframes fadeInSlideUp {
                0% {
                  opacity: 0;
                  transform: translateY(30px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
            
            <p className="text-xl mb-8 text-purple-100">
              Educational videos to help you understand your rights and stay safe
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search videos, topics, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-purple-200 focus:bg-white/20 focus:border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Videos */}
      {searchTerm === '' && selectedCategory === 'all' && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Videos</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredVideos.slice(0, 3).map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg group cursor-pointer">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white h-48 flex items-center justify-center">
                      <div className="text-6xl mb-2">{video.thumbnail}</div>
                    </div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button className="bg-white text-purple-600 hover:bg-purple-50 rounded-full w-16 h-16 p-0">
                        <Play className="h-8 w-8 ml-1" />
                      </Button>
                    </div>
                    <Badge className="absolute top-4 left-4 bg-black/60 text-white">
                      {video.category}
                    </Badge>
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {formatViews(video.views)} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {video.date}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter and Categories */}
      <section className="py-8 bg-gray-100 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Filter by Category:</span>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {filteredVideos.length} videos found
            </div>
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                <div className="relative">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white h-36 flex items-center justify-center">
                    <div className="text-4xl">{video.thumbnail}</div>
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="bg-white text-purple-600 hover:bg-purple-50 rounded-full w-12 h-12 p-0">
                      <Play className="h-6 w-6 ml-0.5" />
                    </Button>
                  </div>
                  <Badge className="absolute top-2 left-2 bg-black/60 text-white text-xs">
                    {video.category}
                  </Badge>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{video.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {video.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {video.date}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatViews(video.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {video.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {video.comments}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      Watch
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📹</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No videos found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Video Categories Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.filter(cat => cat !== 'all').map((category) => {
              const categoryVideos = videos.filter(v => v.category === category)
              const totalViews = categoryVideos.reduce((sum, v) => sum + v.views, 0)
              const totalVideos = categoryVideos.length
              
              return (
                <Card key={category} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{category}</h3>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{totalVideos} videos</span>
                      <span>{formatViews(totalViews)} views</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 text-purple-100">
              Subscribe to get notified about new awareness videos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-purple-200 focus:bg-white/20 focus:border-white"
              />
              <Button className="bg-white text-purple-600 hover:bg-purple-50">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}