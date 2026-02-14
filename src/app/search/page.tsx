'use client'

import { useState } from 'react'
import {
  Search,
  Mic,
  ChevronDown,
  ChevronUp,
  Volume2,
  FileText,
  AlertTriangle,
  Gavel
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface SectionPrediction {
  section: string
  title: string
  category: string
  matchPercentage: number
  description: string
  punishment: string
}

export default function SearchPage() {
  const [complaint, setComplaint] = useState('')
  const [results, setResults] = useState<SectionPrediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState('')

  const handlePredict = async () => {
    if (!complaint.trim()) return

    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('http://localhost:8081/api/laws/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ complaint })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch predictions')
      }

      const data = await response.json()
      setResults(data)
    } catch (err: any) {
      setError('Something went wrong while predicting sections.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition

      const recognition = new SpeechRecognition()
      recognition.lang = 'en-IN'

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onerror = () => setIsListening(false)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setComplaint(transcript)
      }

      recognition.start()
    }
  }

  const avgConfidence = results.length > 0 
    ? Math.round(results.reduce((acc, curr) => acc + curr.matchPercentage, 0) / results.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
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
              AI Section Predictor
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
            
            <p className="text-lg mb-8 text-blue-100">
              Enter the incident details below to identify relevant sections.
            </p>
            
            {/* NORMAL SIZED Search Bar - Inline Layout */}
            <div className="max-w-2xl mx-auto relative group">
              <div className="bg-white p-1.5 rounded-xl shadow-xl flex items-center gap-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-300">
                  <Search className="ml-3 text-gray-400 h-5 w-5 flex-shrink-0" />
                  
                  <Input
                      placeholder="Describe the incident..."
                      value={complaint}
                      onChange={(e) => setComplaint(e.target.value)}
                      className="flex-1 border-0 focus-visible:ring-0 focus-visible:shadow-none px-2 text-gray-800 placeholder:text-gray-400 h-10"
                      onKeyDown={(e) => e.key === 'Enter' && handlePredict()}
                  />
                  
                  <Button
                      variant="ghost"
                      size="sm"
                      className={`rounded-full h-9 w-9 p-0 ${isListening ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}
                      onClick={handleVoiceSearch}
                      disabled={isListening}
                  >
                      <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
                  </Button>
                  
                  <Button 
                      onClick={handlePredict} 
                      disabled={isLoading || !complaint.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-6 rounded-lg font-medium transition-all"
                  >
                      {isLoading ? '...' : 'Analyze'}
                  </Button>
              </div>
              
              {error && (
                <div className="absolute top-full left-0 w-full mt-3 text-center">
                    <div className="inline-block text-red-200 bg-red-900/40 px-4 py-1.5 rounded-lg text-xs border border-red-500/30">
                        {error}
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      {results.length > 0 && !isLoading && (
        <section className="py-6 bg-white border-b shadow-sm">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-xl font-bold text-blue-700">{results.length}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Sections Found</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-blue-700">{avgConfidence}%</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Avg Confidence</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-blue-700">BNS</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Code</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-blue-700">AI</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Verified</div>
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* Main Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Empty State */}
            {!isLoading && results.length === 0 && !error && (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Gavel className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Analyze</h3>
                    <p className="text-gray-500 text-sm">
                        Enter a description in the search bar above.
                    </p>
                </div>
            )}

            {/* Results List - Improved Visibility */}
            <div className="space-y-4">
              {results.map((section) => (
                <Card key={section.section} className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white overflow-hidden">
                  {/* Header with slight gray tint for contrast against white body */}
                  <CardHeader className="bg-slate-50 pb-4 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Gavel className="h-5 w-5 text-blue-700" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Section {section.section}
                                    </h3>
                                    <Badge variant="secondary" className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5">
                                        {section.category}
                                    </Badge>
                                </div>
                                <CardTitle className="text-base text-gray-800 font-medium">
                                    {section.title}
                                </CardTitle>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 min-w-[100px]">
                             <div className="text-right">
                                <span className={`text-sm font-bold ${section.matchPercentage > 80 ? 'text-green-600' : 'text-orange-600'}`}>
                                    {section.matchPercentage}%
                                </span>
                                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Match</p>
                            </div>
                             <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8">
                                <Volume2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={`item-${section.section}`} className="border-0">
                            <AccordionTrigger className="text-blue-600 hover:text-blue-800 hover:bg-gray-50/50 px-6 py-3 text-sm font-semibold no-underline">
                                View Details
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                                <div className="space-y-4 mt-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-gray-700">
                                            <FileText className="h-4 w-4" />
                                            <h4 className="font-bold text-sm uppercase tracking-wide">Description</h4>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed text-sm pl-6">
                                            {section.description}
                                        </p>
                                    </div>

                                    <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex gap-3">
                                        <div className="bg-red-100 text-red-600 p-1.5 rounded-full h-fit shrink-0">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-red-800 mb-1 flex items-center gap-2 text-xs uppercase">
                                                Punishment
                                            </h4>
                                            <p className="text-red-700/90 leading-relaxed text-sm">
                                                {section.punishment}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}