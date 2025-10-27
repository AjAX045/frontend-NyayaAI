'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  Newspaper, 
  Play, 
  Shield, 
  Users, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  MessageCircle,
  ChevronRight,
  Clock,
  ExternalLink,
  Video,
  FileText,
  HelpCircle,
  Bot,
  Send,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'

export default function PublicAwarenessPortal() {
  const [selectedLaw, setSelectedLaw] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' })

  const lawsAndRights = [
    {
      id: 1,
      title: "How to File an FIR",
      description: "Step-by-step guide to filing a First Information Report",
      icon: FileText,
      color: "bg-blue-500",
      content: {
        steps: [
          "Visit the nearest police station or use the online portal",
          "Provide detailed information about the incident",
          "Include date, time, location, and description",
          "Submit any evidence or witnesses information",
          "Get a copy of the filed FIR for your records"
        ],
        importantPoints: [
          "FIR can be filed for cognizable offenses",
          "Police must file FIR if the offense is cognizable",
          "You can file FIR online or in person",
          "Always keep a copy of your FIR"
        ],
        links: [
          { title: "Official FIR Portal", url: "#" },
          { title: "BNS Section 154", url: "#" }
        ]
      }
    },
    {
      id: 2,
      title: "Your Rights During Police Interaction",
      description: "Know your constitutional rights when dealing with law enforcement",
      icon: Shield,
      color: "bg-green-500",
      content: {
        steps: [
          "Right to remain silent",
          "Right to legal representation",
          "Right to inform family or friend",
          "Right to medical examination if needed",
          "Right to know the reason for arrest"
        ],
        importantPoints: [
          "You cannot be detained beyond 24 hours without judicial remand",
          "Women can only be searched by female officers",
          "You have the right to a fair and just procedure",
          "Always ask for identification of police officers"
        ],
        links: [
          { title: "Constitutional Rights", url: "#" },
          { title: "Criminal Procedure Code", url: "#" }
        ]
      }
    },
    {
      id: 3,
      title: "Cybercrime Reporting",
      description: "How to report and protect yourself from cyber crimes",
      icon: AlertTriangle,
      color: "bg-purple-500",
      content: {
        steps: [
          "Document all evidence (screenshots, emails)",
          "File a complaint at the cyber crime cell",
          "Report to the National Cyber Crime Reporting Portal",
          "Preserve digital evidence carefully",
          "Follow up on your complaint regularly"
        ],
        importantPoints: [
          "Report cyber crimes within 24 hours",
          "Don't delete any potential evidence",
          "Change all passwords immediately",
          "Inform your bank about financial fraud"
        ],
        links: [
          { title: "Cyber Crime Portal", url: "#" },
          { title: "IT Act 2000", url: "#" }
        ]
      }
    },
    {
      id: 4,
      title: "Women's Safety Laws",
      description: "Legal provisions and protections for women's safety",
      icon: Users,
      color: "bg-pink-500",
      content: {
        steps: [
          "Know about special provisions for women",
          "Understand harassment laws",
          "Learn about domestic violence protection",
          "Know emergency helpline numbers",
          "Understand workplace safety laws"
        ],
        importantPoints: [
          "Women can file FIR from any police station",
          "Special women cells available in major cities",
          "Identity of victims is protected",
          "Fast-track courts for cases against women"
        ],
        links: [
          { title: "Women Helpline", url: "#" },
          { title: "Protection Acts", url: "#" }
        ]
      }
    },
    {
      id: 5,
      title: "Traffic Rules & Penalties",
      description: "Essential traffic laws and consequences of violations",
      icon: AlertTriangle,
      color: "bg-orange-500",
      content: {
        steps: [
          "Always carry valid driving license",
          "Follow traffic signals and signs",
          "Wear helmet and seatbelt",
          "Don't use mobile while driving",
          "Follow speed limits"
        ],
        importantPoints: [
          "Drunken driving is a serious offense",
          "Overloading vehicles is illegal",
          "Traffic violations can affect insurance",
          "Electronic monitoring is increasing"
        ],
        links: [
          { title: "Motor Vehicles Act", url: "#" },
          { title: "Traffic Fines", url: "#" }
        ]
      }
    },
    {
      id: 6,
      title: "Child Protection Laws",
      description: "Legal framework for protecting children's rights",
      icon: Users,
      color: "bg-indigo-500",
      content: {
        steps: [
          "Understand POCSO Act provisions",
          "Know child labor laws",
          "Learn about education rights",
          "Understand juvenile justice system",
          "Report child abuse immediately"
        ],
        importantPoints: [
          "Child abuse is a serious offense",
          "Mandatory reporting of child abuse",
          "Special courts for juvenile cases",
          "Child identity is strictly protected"
        ],
        links: [
          { title: "POCSO Act", url: "#" },
          { title: "Child Rights Commission", url: "#" }
        ]
      }
    }
  ]

  const awarenessCampaigns = [
    {
      id: 1,
      title: "Say No to Cyber Fraud",
      description: "Protect yourself from online scams and fraud",
      image: "🛡️",
      category: "Cyber Safety",
      date: "2024-01-15",
      readMore: "Learn about common cyber fraud tactics and how to stay safe online."
    },
    {
      id: 2,
      title: "Be Aware of Fake Calls",
      description: "Identify and report fraudulent phone calls",
      image: "📞",
      category: "Scam Alert",
      date: "2024-01-12",
      readMore: "Recognize fake calls from banks, government agencies, and other organizations."
    },
    {
      id: 3,
      title: "Safety in Public Transport",
      description: "Stay safe while using public transportation",
      image: "🚌",
      category: "Public Safety",
      date: "2024-01-10",
      readMore: "Essential safety tips for daily commuters using public transport."
    },
    {
      id: 4,
      title: "Domestic Violence Help",
      description: "Resources and support for domestic violence victims",
      image: "🏠",
      category: "Social Awareness",
      date: "2024-01-08",
      readMore: "Available resources and legal options for domestic violence survivors."
    }
  ]

  const newsAndAlerts = [
    {
      id: 1,
      title: "Cybersecurity Week 2025 Launched by Police Department",
      description: "Week-long awareness campaign to educate citizens about cyber safety",
      image: "🔐",
      date: "2024-01-20",
      category: "News",
      author: "Police Department"
    },
    {
      id: 2,
      title: "Online FIR Portal Adds AI Section Prediction",
      description: "New AI-powered feature helps citizens file FIRs in correct sections",
      image: "🤖",
      date: "2024-01-18",
      category: "Update",
      author: "Tech Team"
    },
    {
      id: 3,
      title: "Awareness Drive in Schools",
      description: "Police department conducts legal awareness programs in 50 schools",
      image: "🏫",
      date: "2024-01-15",
      category: "Campaign",
      author: "Outreach Team"
    }
  ]

  const helplineNumbers = [
    { service: "Police Emergency", number: "100", available: "24/7" },
    { service: "Women Helpline", number: "1091", available: "24/7" },
    { service: "Cyber Cell", number: "155260", available: "24/7" },
    { service: "Childline", number: "1098", available: "24/7" },
    { service: "Ambulance", number: "108", available: "24/7" },
    { service: "Fire Emergency", number: "101", available: "24/7" }
  ]

  const handleChatSubmit = async () => {
    if (chatInput.trim()) {
      const userMessage = {
        id: Date.now(),
        text: chatInput,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      }
      setChatMessages([...chatMessages, userMessage])
      
      try {
        const response = await fetch('/api/awareness-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: chatInput }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          const aiResponse = {
            id: Date.now() + 1,
            text: data.response,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString()
          }
          setChatMessages(prev => [...prev, aiResponse])
        } else {
          throw new Error(data.error || 'Failed to get response')
        }
      } catch (error) {
        console.error('Chat error:', error)
        const errorMessage = {
          id: Date.now() + 1,
          text: "I apologize, but I'm having trouble processing your request right now. Please try again later or contact your nearest police station for immediate assistance.",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        }
        setChatMessages(prev => [...prev, errorMessage])
      }
      
      setChatInput('')
    }
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    // Handle feedback submission
    alert('Thank you for your feedback! We will review it shortly.')
    setFeedback({ name: '', email: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
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
              Know Your Rights. Stay Informed. Stay Safe.
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
              Learn about FIR procedures, laws, and safety initiatives by the police.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <BookOpen className="mr-2 h-5 w-5" />
                Read Legal Guides
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Newspaper className="mr-2 h-5 w-5" />
                Latest News & Updates
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Play className="mr-2 h-5 w-5" />
                Watch Awareness Videos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Laws & Rights Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-pulse">Laws & Rights</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understand your legal rights and responsibilities as a citizen
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawsAndRights.map((law) => (
              <Dialog key={law.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 rounded-lg ${law.color} flex items-center justify-center mb-4`}>
                        <law.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{law.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {law.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                        Learn More
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
                  <DialogHeader className="pb-4 border-b border-gray-100">
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                      <div className={`w-10 h-10 rounded-lg ${law.color} flex items-center justify-center`}>
                        <law.icon className="h-5 w-5 text-white" />
                      </div>
                      {law.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-2">
                      {law.description}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Step-by-Step Guide</h4>
                      <ol className="space-y-2">
                        {law.content.steps.map((step, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Important Points</h4>
                      <ul className="space-y-2">
                        {law.content.importantPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Helpful Resources</h4>
                      <div className="space-y-2">
                        {law.content.links.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Awareness Campaigns Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-pulse">Awareness Campaigns</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our initiatives to create a safer and more informed community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awarenessCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{campaign.image}</div>
                  <Badge variant="secondary" className="w-fit mx-auto mb-2">
                    {campaign.category}
                  </Badge>
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{campaign.date}</span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Read More
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border border-gray-200 shadow-xl">
                      <DialogHeader className="pb-4 border-b border-gray-100">
                        <DialogTitle className="text-2xl">{campaign.title}</DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2">{campaign.description}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-gray-700">{campaign.readMore}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>Published on {campaign.date}</span>
                        </div>
                        <Button className="w-full">
                          Share This Campaign
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News & Alerts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-pulse">News & Alerts</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest announcements and safety alerts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsAndAlerts.map((news) => (
              <Card key={news.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{news.category}</Badge>
                    <span className="text-sm text-gray-500">{news.date}</span>
                  </div>
                  <div className="text-3xl mb-3">{news.image}</div>
                  <CardTitle className="text-lg">{news.title}</CardTitle>
                  <CardDescription>{news.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {news.author}</span>
                    <Button variant="ghost" size="sm">
                      Read More
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Helpline Directory Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-pulse">Helpline Directory</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Emergency contact numbers for immediate assistance
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Helplines
                </CardTitle>
                <CardDescription>
                  Save these numbers for emergencies. Available 24/7 unless specified.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {helplineNumbers.map((helpline, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Phone className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{helpline.service}</h4>
                          <p className="text-sm text-gray-500">{helpline.available}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">{helpline.number}</p>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-blue-900">Find Nearest Police Station</h4>
                      <p className="text-sm text-blue-700">Locate your nearest police station on Google Maps</p>
                    </div>
                    <Button variant="outline" className="ml-auto">
                      <MapPin className="h-4 w-4 mr-2" />
                      View Map
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feedback & Reporting Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-pulse">Feedback & Reporting</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help us improve by sharing your feedback and reporting concerns
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Feedback</CardTitle>
                <CardDescription>
                  Your input helps us serve the community better
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <Input
                        value={feedback.name}
                        onChange={(e) => setFeedback({...feedback, name: e.target.value})}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={feedback.email}
                        onChange={(e) => setFeedback({...feedback, email: e.target.value})}
                        placeholder="Your email"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      value={feedback.message}
                      onChange={(e) => setFeedback({...feedback, message: e.target.value})}
                      placeholder="Share your feedback, report misleading information, or suggest new awareness topics..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 animate-pulse border-2 border-white"
          >
            <Bot className="h-8 w-8 text-white" />
          </Button>
        ) : (
          <Card className="w-96 shadow-2xl bg-gradient-to-br from-white to-gray-50 border-0 transform transition-all duration-300 animate-in slide-in-from-bottom-5">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">LegalBot Assistant</h3>
                    <p className="text-xs text-blue-100 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Online & Ready to Help
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <HelpCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Welcome to LegalBot! 👋</h4>
                  <p className="text-sm text-gray-600 mb-4">I'm here to help you understand your legal rights and procedures</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      onClick={() => setChatInput("How do I file an FIR?")}
                    >
                      📝 File FIR
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      onClick={() => setChatInput("What are my rights during police interaction?")}
                    >
                      🛡️ My Rights
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                      onClick={() => setChatInput("How to report cybercrime?")}
                    >
                      💻 Cybercrime
                    </Button>
                  </div>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl shadow-md ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                        <span className="text-white text-xs font-bold">You</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 rounded-b-lg">
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your legal rights..."
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full"
                />
                <Button 
                  onClick={handleChatSubmit} 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full w-10 h-10 p-0 transform hover:scale-105 transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">Powered by AI • 100% Confidential</p>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-gray-500">Encrypted</span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}