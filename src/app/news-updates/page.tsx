'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  Filter,
  ArrowRight,
  Share2,
  Bookmark,
  Eye,
  MessageCircle,
  Heart
} from 'lucide-react'

export default function NewsUpdatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const newsArticles = [
    {
      id: 1,
      title: "Cybersecurity Week 2025 Launched by Police Department",
      description: "Week-long awareness campaign to educate citizens about cyber safety and best practices for online protection.",
      content: "The Police Department has launched a comprehensive Cybersecurity Week 2025 initiative aimed at educating citizens about the growing importance of online safety. The campaign includes workshops, seminars, and awareness programs across the city.",
      image: "🔐",
      category: "News",
      date: "2024-01-20",
      author: "Police Department",
      readTime: "5 min read",
      views: 1520,
      likes: 89,
      comments: 12,
      featured: true,
      tags: ["cybersecurity", "awareness", "campaign"]
    },
    {
      id: 2,
      title: "Online FIR Portal Adds AI Section Prediction",
      description: "New AI-powered feature helps citizens file FIRs in correct sections, making the process more user-friendly.",
      content: "In a major technological advancement, the Online FIR Portal now features AI-powered section prediction that assists citizens in filing complaints under the appropriate legal sections. This innovation aims to make the FIR filing process more accessible to the general public.",
      image: "🤖",
      category: "Update",
      date: "2024-01-18",
      author: "Tech Team",
      readTime: "3 min read",
      views: 2340,
      likes: 156,
      comments: 23,
      featured: true,
      tags: ["technology", "AI", "FIR", "innovation"]
    },
    {
      id: 3,
      title: "Awareness Drive in Schools Reaches 50 Institutions",
      description: "Police department conducts legal awareness programs in 50 schools, educating students about their rights and responsibilities.",
      content: "The police department's outreach team has successfully conducted legal awareness programs in 50 schools across the district. The initiative aims to educate young students about their legal rights, responsibilities, and the importance of law enforcement in society.",
      image: "🏫",
      category: "Campaign",
      date: "2024-01-15",
      author: "Outreach Team",
      readTime: "4 min read",
      views: 980,
      likes: 67,
      comments: 8,
      featured: false,
      tags: ["education", "awareness", "schools", "outreach"]
    },
    {
      id: 4,
      title: "New Women's Safety Helpline Launched",
      description: "24/7 dedicated helpline for women's safety with immediate response and counseling services.",
      content: "A new dedicated women's safety helpline has been launched to provide immediate assistance and counseling services. The helpline operates 24/7 and is staffed by trained female officers and counselors.",
      image: "🛡️",
      category: "News",
      date: "2024-01-12",
      author: "Women's Cell",
      readTime: "3 min read",
      views: 3200,
      likes: 234,
      comments: 45,
      featured: true,
      tags: ["women", "safety", "helpline", "24/7"]
    },
    {
      id: 5,
      title: "Traffic Violation Detection System Upgraded",
      description: "Advanced AI-powered cameras installed at major intersections to reduce traffic violations.",
      content: "The traffic management system has been upgraded with advanced AI-powered cameras that can detect violations in real-time. This upgrade is expected to reduce traffic violations by 40% and improve road safety.",
      image: "🚦",
      category: "Update",
      date: "2024-01-10",
      author: "Traffic Department",
      readTime: "4 min read",
      views: 1450,
      likes: 98,
      comments: 15,
      featured: false,
      tags: ["traffic", "AI", "safety", "technology"]
    },
    {
      id: 6,
      title: "Community Policing Initiative Shows Positive Results",
      description: "Community policing program leads to 30% reduction in local crime rates over six months.",
      content: "The community policing initiative launched six months ago has shown remarkable results with a 30% reduction in local crime rates. The program focuses on building trust between police and local communities.",
      image: "🤝",
      category: "Campaign",
      date: "2024-01-08",
      author: "Community Relations",
      readTime: "6 min read",
      views: 1100,
      likes: 87,
      comments: 19,
      featured: false,
      tags: ["community", "policing", "safety", "results"]
    }
  ]

  const categories = ['all', 'News', 'Update', 'Campaign']

  const filteredNews = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredNews = newsArticles.filter(article => article.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
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
              Latest News & Updates
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
            
            <p className="text-xl mb-8 text-blue-100">
              Stay informed with the latest announcements, updates, and safety alerts from the police department
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search news, updates, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-blue-200 focus:bg-white/20 focus:border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {searchTerm === '' && selectedCategory === 'all' && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.slice(0, 2).map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                    <div className="text-6xl mb-4 text-center">{article.image}</div>
                    <Badge className="bg-white/20 text-white mb-3">{article.category}</Badge>
                    <h3 className="text-2xl font-bold mb-3">{article.title}</h3>
                    <p className="text-blue-100 mb-4">{article.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-blue-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </span>
                      </div>
                      <Button className="bg-white text-blue-600 hover:bg-blue-50">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
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
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Filter by Category:</span>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {filteredNews.length} articles found
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    <span className="text-sm text-gray-500">{article.date}</span>
                  </div>
                  <div className="text-4xl mb-3 text-center">{article.image}</div>
                  <CardTitle className="text-lg mb-2 line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-3">{article.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {article.readTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {article.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {article.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {article.comments}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 text-blue-100">
              Subscribe to our newsletter for the latest news and updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-blue-200 focus:bg-white/20 focus:border-white"
              />
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}