'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { 
  Search, 
  HelpCircle, 
  Shield, 
  FileText, 
  Users, 
  AlertTriangle,
  Phone,
  Clock,
  ChevronRight,
  BookOpen,
  Gavel,
  Scale,
  MessageCircle,
  Star
} from 'lucide-react'

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const faqCategories = [
    { id: 'all', name: 'All Categories', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'fir', name: 'FIR Procedures', icon: <FileText className="h-4 w-4" /> },
    { id: 'rights', name: 'Legal Rights', icon: <Shield className="h-4 w-4" /> },
    { id: 'bns', name: 'BNS & Laws', icon: <Gavel className="h-4 w-4" /> },
    { id: 'safety', name: 'Safety & Security', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'women', name: 'Women\'s Rights', icon: <Users className="h-4 w-4" /> },
    { id: 'cyber', name: 'Cyber Crime', icon: <Scale className="h-4 w-4" /> },
    { id: 'emergency', name: 'Emergency', icon: <Phone className="h-4 w-4" /> }
  ]

  const faqs = [
    {
      id: 1,
      category: 'fir',
      question: 'What is an FIR and when should I file one?',
      answer: 'An FIR (First Information Report) is a written document prepared by police when they receive information about the commission of a cognizable offense. You should file an FIR when you are a victim or witness to a serious crime such as theft, robbery, assault, murder, kidnapping, or any other cognizable offense under the law.',
      helpful: 234,
      views: 1520
    },
    {
      id: 2,
      category: 'fir',
      question: 'Can I file an FIR online?',
      answer: 'Yes, many states now allow online FIR filing through their official police websites or mobile apps. You can visit your state police department\'s official website and look for the "Online FIR" or "e-FIR" option. However, for serious crimes, it\'s recommended to visit the police station in person.',
      helpful: 189,
      views: 980
    },
    {
      id: 3,
      category: 'rights',
      question: 'What are my rights during police interrogation?',
      answer: 'During police interrogation, you have the right to remain silent, the right to legal representation, the right to inform a family member or friend, the right to know the reason for arrest, and the right to be produced before a magistrate within 24 hours of arrest. You cannot be detained beyond 24 hours without judicial remand.',
      helpful: 312,
      views: 2100
    },
    {
      id: 4,
      category: 'rights',
      question: 'Can police search my house without a warrant?',
      answer: 'Generally, police need a search warrant to search your house. However, they can conduct a search without a warrant in certain circumstances such as when you give consent, during a lawful arrest, in emergency situations, or when there is reasonable belief that evidence is about to be destroyed.',
      helpful: 156,
      views: 890
    },
    {
      id: 5,
      category: 'bns',
      question: 'What is the Bharatiya Nyaya Sanhita (BNS)?',
      answer: 'The Bharatiya Nyaya Sanhita (BNS) is the new criminal code that replaces the Indian Penal Code (IPC). It was introduced to modernize and streamline India\'s criminal justice system. The BNS includes new offenses, changes in punishment, and provisions to deal with modern forms of crime while maintaining the essence of criminal law.',
      helpful: 267,
      views: 1450
    },
    {
      id: 6,
      category: 'bns',
      question: 'How is BNS different from IPC?',
      answer: 'The BNS introduces several changes from the IPC including new offenses like organized crime, terrorist acts, and mob lynching. It restructures offenses, changes some punishments, introduces community service as a form of punishment, and includes provisions for electronic evidence and modern forms of crime.',
      helpful: 198,
      views: 1120
    },
    {
      id: 7,
      category: 'safety',
      question: 'What should I do if I witness a crime?',
      answer: 'If you witness a crime, first ensure your own safety. Then call the emergency helpline number 100 immediately. Note down important details like the location, time, description of perpetrators, and any vehicle numbers. If it\'s safe to do so, take photos or videos as evidence. Cooperate with police when they arrive.',
      helpful: 145,
      views: 780
    },
    {
      id: 8,
      category: 'women',
      question: 'What special protections exist for women under Indian law?',
      answer: 'Indian law provides several special protections for women including the Protection of Women from Domestic Violence Act, Sexual Harassment of Women at Workplace Act, special provisions for rape and sexual assault, dowry prohibition laws, and the right to file FIR from any police station for certain offenses. Women can only be searched by female officers.',
      helpful: 289,
      views: 1890
    },
    {
      id: 9,
      category: 'women',
      question: 'Which helpline numbers should women know?',
      answer: 'Women should know these important helpline numbers: 1091 - Women Helpline, 181 - Women Helpline (Domestic Violence), 112 - Emergency, 1098 - Childline (for women with children), 155260 - Cyber Crime Reporting. These helplines operate 24/7 and provide immediate assistance.',
      helpful: 234,
      views: 1560
    },
    {
      id: 10,
      category: 'cyber',
      question: 'How do I report cyber crime?',
      answer: 'To report cyber crime, you can: 1) File a complaint at your local police station\'s cyber cell, 2) Use the National Cyber Crime Reporting Portal (cybercrime.gov.in), 3) Call the cyber crime helpline 155260, 4) Document all evidence (screenshots, emails, URLs), 5) Preserve digital evidence and don\'t delete anything.',
      helpful: 178,
      views: 920
    },
    {
      id: 11,
      category: 'cyber',
      question: 'What are common types of cyber fraud?',
      answer: 'Common types of cyber fraud include: phishing emails, online shopping scams, fake job offers, OTP fraud, bank account fraud, social media hacking, online dating scams, investment fraud, and ransomware attacks. Always verify before sharing personal or financial information online.',
      helpful: 201,
      views: 1100
    },
    {
      id: 12,
      category: 'emergency',
      question: 'What are the important emergency helpline numbers?',
      answer: 'Important emergency helpline numbers in India: 112 - Unified Emergency Number, 100 - Police, 101 - Fire, 108 - Ambulance, 1091 - Women Helpline, 1098 - Childline, 1516 - Legal Aid, 155260 - Cyber Crime. Save these numbers for emergencies.',
      helpful: 345,
      views: 2300
    },
    {
      id: 13,
      category: 'emergency',
      question: 'What should I do in case of a medical emergency?',
      answer: 'In a medical emergency: 1) Call 108 for ambulance immediately, 2) Provide clear address and patient condition, 3) Don\'t move the patient unless necessary, 4) Perform basic first aid if trained, 5) Gather patient\'s medical documents, 6) Inform family members, 7) Stay calm and follow medical personnel\'s instructions.',
      helpful: 167,
      views: 890
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (categoryId) => {
    const category = faqCategories.find(cat => cat.id === categoryId)
    return category ? category.icon : <HelpCircle className="h-4 w-4" />
  }

  const getCategoryName = (categoryId) => {
    const category = faqCategories.find(cat => cat.id === categoryId)
    return category ? category.name : 'General'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
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
              Frequently Asked Questions
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
              Get answers to common legal questions and understand your rights better
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for answers to your questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-blue-200 focus:bg-white/20 focus:border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{faqs.length}</div>
              <div className="text-sm text-gray-600">Total FAQs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{faqCategories.length - 1}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">Free</div>
              <div className="text-sm text-gray-600">Legal Help</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {faqCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 ${
                  selectedCategory === category.id ? "bg-blue-600 hover:bg-blue-700" : ""
                }`}
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>
          <div className="text-center mt-4 text-sm text-gray-600">
            {filteredFAQs.length} questions found
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {getCategoryIcon(faq.category)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {getCategoryName(faq.category)}
                            </Badge>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {faq.helpful} helpful
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {faq.views} views
                              </span>
                            </div>
                          </div>
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value={`item-${faq.id}`} className="border-0">
                              <AccordionTrigger className="text-left hover:no-underline">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {faq.question}
                                </h3>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="pt-4">
                                  <p className="text-gray-700 leading-relaxed mb-4">
                                    {faq.answer}
                                  </p>
                                  <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex items-center gap-2">
                                      <Button variant="outline" size="sm">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Helpful
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <ChevronRight className="h-4 w-4 mr-2" />
                                        Related Questions
                                      </Button>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Last updated: Recently
                                    </div>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No questions found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Popular Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg">FIR Process</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Complete guide to filing FIRs and understanding the process
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View All FIR FAQs
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Legal Rights</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Understand your fundamental rights and legal protections
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View All Rights FAQs
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Emergency Help</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Emergency contacts and what to do in critical situations
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View All Emergency FAQs
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Can't find what you're looking for? Our legal experts are here to help
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <MessageCircle className="mr-2 h-5 w-5" />
                Ask a Question
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Phone className="mr-2 h-5 w-5" />
                Call Helpline
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">24/7 Helpline</h3>
                <p className="text-blue-100">Get immediate assistance anytime</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Legal Resources</h3>
                <p className="text-blue-100">Comprehensive guides and articles</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
                <p className="text-blue-100">Professional legal guidance</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}