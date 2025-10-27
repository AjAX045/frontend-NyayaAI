'use client'

import { useState } from 'react'
import PoliceLayout from '@/components/police-layout'
import { 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  Brain,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'

interface FormData {
  // Complainant Details
  complainantName: string
  contactNumber: string
  address: string
  
  // Incident Details
  incidentDate: string
  incidentTime: string
  location: string
  incidentType: string
  complaintText: string
}

const incidentTypes = [
  'Theft', 'Assault', 'Fraud', 'Harassment', 'Property Dispute', 
  'Cyber Crime', 'Domestic Violence', 'Traffic Accident', 'Other'
]

export default function RegisterFIR() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    complainantName: '',
    contactNumber: '',
    address: '',
    incidentDate: '',
    incidentTime: '',
    location: '',
    incidentType: '',
    complaintText: ''
  })
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const totalSteps = 3
  const progressPercentage = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.complainantName.trim()) newErrors.complainantName = 'Name is required'
      if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required'
      else if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = 'Invalid phone number'
      if (!formData.address.trim()) newErrors.address = 'Address is required'
    }

    if (step === 2) {
      if (!formData.incidentDate) newErrors.incidentDate = 'Incident date is required'
      if (!formData.incidentTime) newErrors.incidentTime = 'Incident time is required'
      if (!formData.location.trim()) newErrors.location = 'Location is required'
      if (!formData.incidentType) newErrors.incidentType = 'Incident type is required'
      if (!formData.complaintText.trim()) newErrors.complaintText = 'Complaint details are required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGenerateAI = async () => {
    if (!validateStep(2)) return
    
    setIsGeneratingAI(true)
    
    // Pass complaint text and FIR form data as URL parameters to AI suggestions page
    const encodedComplaint = encodeURIComponent(formData.complaintText)
    const encodedFirData = encodeURIComponent(JSON.stringify(formData))
    
    // Simulate processing time, then navigate
    setTimeout(() => {
      setIsGeneratingAI(false)
      router.push(`/police/ai-suggestions?complaint=${encodedComplaint}&firData=${encodedFirData}`)
    }, 1000) // Reduced to 1 second for better UX
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Complainant Details</span>
              </CardTitle>
              <CardDescription>
                Please provide information about the person filing the FIR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complainantName">Name *</Label>
                  <Input
                    id="complainantName"
                    value={formData.complainantName}
                    onChange={(e) => handleInputChange('complainantName', e.target.value)}
                    placeholder="Enter full name"
                    className={`bg-gray-50 ${errors.complainantName ? 'border-red-500' : ''}`}
                  />
                  {errors.complainantName && (
                    <p className="text-sm text-red-500">{errors.complainantName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className={`bg-gray-50 ${errors.contactNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-red-500">{errors.contactNumber}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Complete address"
                    className={`bg-gray-50 ${errors.address ? 'border-red-500' : ''}`}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Incident Details</span>
              </CardTitle>
              <CardDescription>
                Provide detailed information about the incident
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incidentDate">Date *</Label>
                  <Input
                    id="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                    className={`bg-gray-50 ${errors.incidentDate ? 'border-red-500' : ''}`}
                  />
                  {errors.incidentDate && (
                    <p className="text-sm text-red-500">{errors.incidentDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incidentTime">Time *</Label>
                  <Input
                    id="incidentTime"
                    type="time"
                    value={formData.incidentTime}
                    onChange={(e) => handleInputChange('incidentTime', e.target.value)}
                    className={`bg-gray-50 ${errors.incidentTime ? 'border-red-500' : ''}`}
                  />
                  {errors.incidentTime && (
                    <p className="text-sm text-red-500">{errors.incidentTime}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter incident location"
                      className={`pl-10 bg-gray-50 ${errors.location ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-500">{errors.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incidentType">Type of Incident *</Label>
                  <Select value={formData.incidentType} onValueChange={(value) => handleInputChange('incidentType', value)}>
                    <SelectTrigger className={`bg-white border-gray-300 text-gray-900 ${errors.incidentType ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 text-gray-900">
                      {incidentTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-gray-900 focus:bg-gray-100">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.incidentType && (
                    <p className="text-sm text-red-500">{errors.incidentType}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="complaintText">Complaint Text *</Label>
                  <Textarea
                    id="complaintText"
                    value={formData.complaintText}
                    onChange={(e) => handleInputChange('complaintText', e.target.value)}
                    placeholder="Describe the incident in detail..."
                    rows={6}
                    className={`bg-gray-50 ${errors.complaintText ? 'border-red-500' : ''}`}
                  />
                  {errors.complaintText && (
                    <p className="text-sm text-red-500">{errors.complaintText}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                AI is analyzing your complaint to suggest relevant legal sections...
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
                <CardDescription>
                  Review all information before submitting the FIR
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600">Complainant Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {formData.complainantName}</p>
                      <p><span className="font-medium">Contact:</span> {formData.contactNumber}</p>
                      <p><span className="font-medium">Address:</span> {formData.address}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600">Incident Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Date:</span> {formData.incidentDate}</p>
                      <p><span className="font-medium">Time:</span> {formData.incidentTime}</p>
                      <p><span className="font-medium">Location:</span> {formData.location}</p>
                      <p><span className="font-medium">Type:</span> <Badge variant="secondary">{formData.incidentType}</Badge></p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Complaint Details</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {formData.complaintText}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <PoliceLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Register New FIR</h1>
          <p className="text-gray-600">Fill in the details to file a First Information Report</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className="text-sm font-medium">FIR Details</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 mx-4">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <span className="text-sm font-medium">AI Prediction</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 mx-4">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 3 ? <Check className="h-4 w-4" /> : '3'}
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">
            Step {currentStep} of {totalSteps}: {currentStep === 1 ? 'FIR Details' : currentStep === 2 ? 'AI Prediction' : 'Review'}
          </p>
        </div>

        {/* Form Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === 2 && (
            <Button
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating AI Prediction...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate AI Prediction
                </>
              )}
            </Button>
          )}

          {currentStep === 1 && (
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </PoliceLayout>
  )
}