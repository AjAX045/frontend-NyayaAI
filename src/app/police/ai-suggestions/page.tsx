'use client'

import { useState, useEffect } from 'react'
import PoliceLayout from '@/components/police-layout'
import { 
  Brain, 
  CheckCircle, 
  Edit, 
  ArrowLeft,
  Scale,
  Gavel,
  AlertTriangle,
  TrendingUp,
  FileText,
  Save,
  RefreshCw,
  Search,
  Loader2,
  Plus,
  X,
  User,
  Check,
  XCircle,
  MessageSquare,
  CheckSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface AIPrediction {
  id: string
  sectionNumber: string
  title: string
  description: string
  confidence: number
  punishment: string
  category: string
  isManual?: boolean
  officerAction?: 'accepted' | 'rejected' | 'corrected' | 'pending' // Track officer decision
  correctedSection?: string // If officer corrected this prediction
  feedbackNotes?: string // Officer's feedback notes
}

interface ManualSection {
  id: string
  sectionNumber: string
  title: string
  description: string
  punishment: string
  category: string
}

interface AIFeedbackData {
  predictionId: string
  action: 'accepted' | 'rejected' | 'corrected'
  correctedSection?: string
  feedbackNotes?: string
}

export default function AISuggestions() {
  const [predictions, setPredictions] = useState<AIPrediction[]>([])
  const [complaintText, setComplaintText] = useState('')
  const [inputText, setInputText] = useState('')
  const [selectedPredictions, setSelectedPredictions] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState('input')
  const [mounted, setMounted] = useState(false)
  
  // Manual section addition states
  const [showManualForm, setShowManualForm] = useState(false)
  const [manualSection, setManualSection] = useState<ManualSection>({
    id: '',
    sectionNumber: '',
    title: '',
    description: '',
    punishment: '',
    category: 'Other'
  })
  
  // FIR form data passed from URL params
  const [firFormData, setFirFormData] = useState<any>(null)
  
  // Feedback and correction states
  const [aiFeedbacks, setAiFeedbacks] = useState<AIFeedbackData[]>([])
  const [showCorrectionForm, setShowCorrectionForm] = useState<string | null>('')
  const [correctionData, setCorrectionData] = useState({
    sectionNumber: '',
    title: '',
    description: '',
    feedbackNotes: ''
  })
  
  const router = useRouter()
  const searchParams = useSearchParams()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check for complaint text and FIR data from URL params on mount
  useEffect(() => {
    if (!mounted) return
    
    const complaintFromForm = searchParams.get('complaint')
    const firDataParam = searchParams.get('firData')
    
    if (complaintFromForm) {
      const decodedText = decodeURIComponent(complaintFromForm)
      setComplaintText(decodedText)
      setInputText(decodedText)
      setActiveTab('results')
      // Auto-analyze when complaint is passed from FIR form
      analyzeComplaint(decodedText)
    }
    
    if (firDataParam) {
      try {
        const decodedFirData = JSON.parse(decodeURIComponent(firDataParam))
        setFirFormData(decodedFirData)
      } catch (error) {
        console.error('Failed to parse FIR data from URL:', error)
      }
    }
  }, [searchParams, mounted])

  const analyzeComplaint = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) {
      if (searchParams.get('complaint')) {
        // If we came from FIR form but text is empty, show error
        alert('Complaint text is empty. Please go back and enter complaint details.')
        router.push('/police/register-fir')
      } else {
        alert('Please enter complaint text to analyze')
      }
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/ai-section-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ complaintText: textToAnalyze }),
      })

      const data = await response.json()
      
      if (data.success) {
        setPredictions(data.predictions)
        setComplaintText(textToAnalyze)
        setActiveTab('results')
        
        if (data.fallback) {
          alert('AI analysis completed using fallback system. For more accurate results, please try again later.')
        }
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze complaint. Please try again.')
      // If we came from FIR form and analysis fails, offer to go back
      if (searchParams.get('complaint')) {
        setTimeout(() => {
          if (confirm('Would you like to go back to the FIR form?')) {
            router.push('/police/register-fir')
          }
        }, 1000)
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSearch = () => {
    analyzeComplaint(inputText)
  }

  // Officer feedback functions
  const handleAcceptPrediction = (id: string) => {
    setPredictions(prev => prev.map(pred => 
      pred.id === id 
        ? { ...pred, officerAction: 'accepted' as const }
        : pred
    ))
    
    // Add to selected predictions
    setSelectedPredictions(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
    
    // Track feedback for AI training
    setAiFeedbacks(prev => [
      ...prev.filter(f => f.predictionId !== id),
      {
        predictionId: id,
        action: 'accepted'
      }
    ])
  }

  const handleRejectPrediction = (id: string) => {
    setPredictions(prev => prev.map(pred => 
      pred.id === id 
        ? { ...pred, officerAction: 'rejected' as const }
        : pred
    ))
    
    // Remove from selected predictions
    setSelectedPredictions(prev => prev.filter(p => p !== id))
    
    // Track feedback for AI training
    setAiFeedbacks(prev => [
      ...prev.filter(f => f.predictionId !== id),
      {
        predictionId: id,
        action: 'rejected'
      }
    ])
    
    // Show correction form
    setShowCorrectionForm(id)
  }

  const handleCorrectPrediction = (id: string) => {
    if (!correctionData.sectionNumber.trim() || !correctionData.title.trim()) {
      alert('Section number and title are required for correction.')
      return
    }

    // Update the prediction with corrected data
    setPredictions(prev => prev.map(pred => {
      if (pred.id === id) {
        const correctedPrediction = {
          ...pred,
          officerAction: 'corrected' as const,
          correctedSection: correctionData.sectionNumber,
          sectionNumber: correctionData.sectionNumber,
          title: correctionData.title,
          description: correctionData.description || pred.description,
          feedbackNotes: correctionData.feedbackNotes
        }
        return correctedPrediction
      }
      return pred
    }))

    // Add to selected predictions (corrected ones are automatically selected)
    setSelectedPredictions(prev => [...prev, id])
    
    // Track feedback for AI training
    setAiFeedbacks(prev => [
      ...prev.filter(f => f.predictionId !== id),
      {
        predictionId: id,
        action: 'corrected',
        correctedSection: correctionData.sectionNumber,
        feedbackNotes: correctionData.feedbackNotes
      }
    ])

    // Reset correction form
    setCorrectionData({
      sectionNumber: '',
      title: '',
      description: '',
      feedbackNotes: ''
    })
    setShowCorrectionForm('')
  }

  const handleAcceptAll = () => {
    const allPredictions = predictions.filter(p => !p.isManual && p.officerAction !== 'rejected')
    setSelectedPredictions(allPredictions.map(p => p.id))
    
    // Mark all as accepted
    setPredictions(prev => prev.map(pred => 
      !pred.isManual && pred.officerAction !== 'rejected'
        ? { ...pred, officerAction: 'accepted' as const }
        : pred
    ))
    
    // Track feedback for all accepted predictions
    const newFeedbacks = allPredictions.map(pred => ({
      predictionId: pred.id,
      action: 'accepted' as const
    }))
    setAiFeedbacks(prev => [...prev, ...newFeedbacks])
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      // Get selected predictions (both AI and manual)
      const selectedSections = predictions.filter(p => selectedPredictions.includes(p.id))
      
      if (selectedSections.length === 0) {
        alert('Please select at least one legal section before saving.')
        setIsSaving(false)
        return
      }
      
      // Prepare FIR data for saving
      const firData = {
        complaintText,
        aiPredictions: predictions.filter(p => !p.isManual),
        manualSections: predictions.filter(p => p.isManual),
        selectedSections,
        aiFeedbacks, // Include feedback data for model training
        ...firFormData, // Include FIR form data if available
        timestamp: new Date().toISOString()
      }

      const response = await fetch('/api/save-fir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firData),
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`FIR saved successfully!\nFIR Number: ${result.firNumber}\nFIR ID: ${result.firId}`)
        router.push('/police/register-fir')
      } else {
        throw new Error(result.error || 'Failed to save FIR')
      }
    } catch (error) {
      console.error('Save FIR error:', error)
      alert('Failed to save FIR. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Manual section functions
  const handleAddManualSection = () => {
    if (!manualSection.sectionNumber.trim() || !manualSection.title.trim()) {
      alert('Section number and title are required')
      return
    }

    const newManualPrediction: AIPrediction = {
      ...manualSection,
      id: `manual_${Date.now()}`,
      confidence: 100, // Manual sections have 100% confidence
      isManual: true
    }

    setPredictions(prev => [...prev, newManualPrediction])
    setSelectedPredictions(prev => [...prev, newManualPrediction.id])
    
    // Reset form
    setManualSection({
      id: '',
      sectionNumber: '',
      title: '',
      description: '',
      punishment: '',
      category: 'Other'
    })
    setShowManualForm(false)
  }

  const handleRemoveManualSection = (id: string) => {
    setPredictions(prev => prev.filter(p => p.id !== id))
    setSelectedPredictions(prev => prev.filter(p => p !== id))
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100'
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Property Offense': return 'bg-blue-100 text-blue-800'
      case 'Physical Offense': return 'bg-red-100 text-red-800'
      case 'Offense against Women': return 'bg-orange-100 text-orange-800'
      case 'Financial Offense': return 'bg-purple-100 text-purple-800'
      case 'Intimidation': return 'bg-pink-100 text-pink-800'
      case 'Public Order': return 'bg-gray-100 text-gray-800'
      case 'Serious Offense': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCardColor = (prediction: AIPrediction) => {
    if (prediction.isManual) return 'border-blue-300 bg-blue-50/30'
    if (prediction.officerAction === 'accepted') return 'border-green-300 bg-green-50/30'
    if (prediction.officerAction === 'rejected') return 'border-red-300 bg-red-50/30'
    if (prediction.officerAction === 'corrected') return 'border-yellow-300 bg-yellow-50/30'
    return ''
  }

  const getActionBadge = (prediction: AIPrediction) => {
    if (prediction.isManual) {
      return <Badge className="bg-blue-100 text-blue-800"><User className="h-3 w-3 mr-1" />Manual</Badge>
    }
    if (prediction.officerAction === 'accepted') {
      return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Accepted</Badge>
    }
    if (prediction.officerAction === 'rejected') {
      return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
    }
    if (prediction.officerAction === 'corrected') {
      return <Badge className="bg-yellow-100 text-yellow-800"><CheckSquare className="h-3 w-3 mr-1" />Corrected</Badge>
    }
    return null
  }

  if (!mounted) {
    return (
      <PoliceLayout>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </PoliceLayout>
    )
  }

  return (
    <PoliceLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {searchParams.get('complaint') ? 'AI Section Prediction for FIR' : 'AI Section Analysis'}
              </h1>
              <p className="text-gray-600">
                {searchParams.get('complaint') 
                  ? 'Review and select legal sections for your FIR' 
                  : 'Analyze complaint text to find relevant legal sections'
                }
              </p>
              {searchParams.get('complaint') && (
                <Alert className="mt-3 bg-blue-50 border-blue-200">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Auto-filled from FIR form:</strong> AI is analyzing your complaint text automatically.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex space-x-3">
              {searchParams.get('complaint') && (
                <Link href="/police/register-fir">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to FIR Form
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Input Complaint</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Results</span>
              {predictions.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {predictions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Enter Complaint Text</span>
                </CardTitle>
                <CardDescription>
                  Provide detailed complaint text for AI analysis and section prediction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="complaintInput" className="text-sm font-medium">
                    Complaint Details
                  </label>
                  <Textarea
                    id="complaintInput"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter the complete complaint text here. Include details about what happened, when, where, and who was involved..."
                    rows={8}
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-gray-500">
                    Tip: More detailed complaints provide better section predictions
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleSearch}
                    disabled={isAnalyzing || !inputText.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search Sections
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setInputText('')}
                    disabled={isAnalyzing}
                  >
                    Clear
                  </Button>
                </div>

                {inputText.trim() && (
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Text Preview:</strong> {inputText.substring(0, 200)}
                      {inputText.length > 200 && '...'}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {isAnalyzing ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="h-16 w-16 mx-auto text-blue-600 animate-spin mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI Analysis in Progress
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Analyzing your complaint to find relevant legal sections...
                  </p>
                  <p className="text-sm text-gray-500">
                    This usually takes a few seconds
                  </p>
                </CardContent>
              </Card>
            ) : predictions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Brain className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Analysis Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Enter complaint text and click "Search Sections" to get AI-powered legal section predictions
                  </p>
                  <Button onClick={() => setActiveTab('input')} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Enter Complaint Text
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Complaint Summary */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span>Complaint Summary</span>
                      </CardTitle>
                      <CardDescription>
                        Original complaint text used for AI analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {complaintText}
                        </p>
                      </div>
                      
                      <Separator className="my-4" />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Analysis Status</span>
                          <Badge className="bg-green-100 text-green-800">Complete</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Sections Found</span>
                          <span className="text-sm font-medium">{predictions.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Selected</span>
                          <span className="text-sm font-medium">{selectedPredictions.length}</span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Add Manual Section Button */}
                      <Button
                        variant="outline"
                        className="w-full mb-3"
                        onClick={() => setShowManualForm(!showManualForm)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Manual Section
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setActiveTab('input')}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Analyze New Complaint
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Panel - AI Predictions */}
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          AI Analysis Complete
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => analyzeComplaint(complaintText)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Re-analyze
                        </Button>
                        <Button onClick={handleAcceptAll} size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept All
                        </Button>
                      </div>
                    </div>

                    {/* Manual Section Form */}
                    {showManualForm && (
                      <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center space-x-2 text-blue-800">
                              <User className="h-5 w-5" />
                              <span>Add Manual Section</span>
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowManualForm(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardDescription>
                            Add a legal section that you think is applicable to this case
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Section Number *</label>
                              <Input
                                value={manualSection.sectionNumber}
                                onChange={(e) => setManualSection(prev => ({ ...prev, sectionNumber: e.target.value }))}
                                placeholder="e.g., Section 302"
                                className="bg-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Category</label>
                              <Select 
                                value={manualSection.category} 
                                onValueChange={(value) => setManualSection(prev => ({ ...prev, category: value }))}
                              >
                                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-300 text-gray-900">
                                  <SelectItem value="Property Offense" className="text-gray-900 focus:bg-gray-100">Property Offense</SelectItem>
                                  <SelectItem value="Physical Offense" className="text-gray-900 focus:bg-gray-100">Physical Offense</SelectItem>
                                  <SelectItem value="Offense against Women" className="text-gray-900 focus:bg-gray-100">Offense against Women</SelectItem>
                                  <SelectItem value="Financial Offense" className="text-gray-900 focus:bg-gray-100">Financial Offense</SelectItem>
                                  <SelectItem value="Intimidation" className="text-gray-900 focus:bg-gray-100">Intimidation</SelectItem>
                                  <SelectItem value="Public Order" className="text-gray-900 focus:bg-gray-100">Public Order</SelectItem>
                                  <SelectItem value="Serious Offense" className="text-gray-900 focus:bg-gray-100">Serious Offense</SelectItem>
                                  <SelectItem value="Other" className="text-gray-900 focus:bg-gray-100">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Section Title *</label>
                            <Input
                              value={manualSection.title}
                              onChange={(e) => setManualSection(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., Murder"
                              className="bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                              value={manualSection.description}
                              onChange={(e) => setManualSection(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Brief description of the section..."
                              rows={3}
                              className="bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Punishment</label>
                            <Input
                              value={manualSection.punishment}
                              onChange={(e) => setManualSection(prev => ({ ...prev, punishment: e.target.value }))}
                              placeholder="e.g., Imprisonment up to 10 years"
                              className="bg-white"
                            />
                          </div>
                          <div className="flex space-x-3">
                            <Button onClick={handleAddManualSection} className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Section
                            </Button>
                            <Button variant="outline" onClick={() => setShowManualForm(false)}>
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Prediction Cards */}
                    {predictions.map((prediction) => (
                      <Card 
                        key={prediction.id} 
                        className={`hover-lift transition-all ${
                          selectedPredictions.includes(prediction.id) 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : ''
                        } ${getCardColor(prediction)}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-bold text-lg">{prediction.sectionNumber}</h3>
                                {getActionBadge(prediction)}
                                <Badge className={getCategoryColor(prediction.category)}>
                                  {prediction.category}
                                </Badge>
                                {!prediction.isManual && (
                                  <Badge className={getConfidenceColor(prediction.confidence)}>
                                    {prediction.confidence}% match
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-base">{prediction.title}</CardTitle>
                              {prediction.correctedSection && prediction.correctedSection !== prediction.sectionNumber && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Original: {prediction.sectionNumber} → Corrected to: {prediction.correctedSection}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              {prediction.isManual && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveManualSection(prediction.id)
                                  }}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-gray-700">
                            {prediction.description}
                          </p>
                          
                          {prediction.feedbackNotes && (
                            <Alert>
                              <MessageSquare className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Officer Note:</strong> {prediction.feedbackNotes}
                              </AlertDescription>
                            </Alert>
                          )}

                          {/* Officer Action Buttons */}
                          {!prediction.isManual && (
                            <div className="flex space-x-2 pt-3 border-t">
                              {prediction.officerAction !== 'accepted' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-green-600 border-green-300 hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAcceptPrediction(prediction.id)
                                  }}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                              )}
                              {prediction.officerAction !== 'rejected' && prediction.officerAction !== 'corrected' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRejectPrediction(prediction.id)
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              )}
                            </div>
                          )}

                          {/* Correction Form */}
                          {showCorrectionForm === prediction.id && (
                            <Card className="border-2 border-dashed border-yellow-300 bg-yellow-50">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center space-x-2">
                                  <CheckSquare className="h-4 w-4 text-yellow-600" />
                                  <span>Correct AI Prediction</span>
                                </CardTitle>
                                <CardDescription>
                                  Provide the correct legal section for this case
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Correct Section Number *</label>
                                    <Input
                                      value={correctionData.sectionNumber}
                                      onChange={(e) => setCorrectionData(prev => ({ ...prev, sectionNumber: e.target.value }))}
                                      placeholder="e.g., Section 324"
                                      className="bg-white"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Section Title *</label>
                                    <Input
                                      value={correctionData.title}
                                      onChange={(e) => setCorrectionData(prev => ({ ...prev, title: e.target.value }))}
                                      placeholder="e.g., Cheating"
                                      className="bg-white"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Description</label>
                                  <Textarea
                                    value={correctionData.description}
                                    onChange={(e) => setCorrectionData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Brief description of the correct section..."
                                    rows={2}
                                    className="bg-white"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Feedback Notes (Optional)</label>
                                  <Textarea
                                    value={correctionData.feedbackNotes}
                                    onChange={(e) => setCorrectionData(prev => ({ ...prev, feedbackNotes: e.target.value }))}
                                    placeholder="Why was the AI prediction incorrect?"
                                    rows={2}
                                    className="bg-white"
                                  />
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleCorrectPrediction(prediction.id)}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                  >
                                    <CheckSquare className="h-4 w-4 mr-1" />
                                    Submit Correction
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setShowCorrectionForm('')
                                      setCorrectionData({
                                        sectionNumber: '',
                                        title: '',
                                        description: '',
                                        feedbackNotes: ''
                                      })
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                          
                          <div className="flex items-center space-x-4 pt-2 border-t">
                            <div className="flex items-center space-x-2">
                              <Gavel className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                <span className="font-medium">Punishment:</span> {prediction.punishment}
                              </span>
                            </div>
                            {!prediction.isManual && (
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-gray-500" />
                                <div className="flex-1">
                                  <Progress value={prediction.confidence} className="h-2" />
                                </div>
                                <span className="text-sm text-gray-600">{prediction.confidence}%</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Final Actions */}
                    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                      <CardContent className="p-6">
                        {(() => {
                          const selectedCount = selectedPredictions.length

                          return (
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-lg mb-1">Ready to proceed?</h3>
                                <p className="text-sm text-gray-600">
                                  {selectedCount} section(s) selected{searchParams.get('complaint') ? ' for FIR registration' : ''}
                                </p>
                              </div>
                              <div className="flex space-x-3">
                                <Button variant="outline" onClick={() => setSelectedPredictions([])}>
                                  Clear Selection
                                </Button>
                                {searchParams.get('complaint') && (
                                  <Button 
                                    onClick={handleSaveChanges}
                                    disabled={selectedCount === 0 || isSaving}
                                    className="hover-lift"
                                  >
                                    {isSaving ? (
                                      <>
                                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Saving...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Save Selected Sections
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        })()}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PoliceLayout>
  )
}