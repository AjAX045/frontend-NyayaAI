'use client'

import { useState } from 'react'
import PoliceLayout from '@/components/police-layout'
import { 
  User, MapPin, Calendar, Clock, FileText, Brain,
  ChevronLeft, ChevronRight, Check, AlertCircle, Loader2
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
    // Simulate AI processing and navigate
    const encodedComplaint = encodeURIComponent(formData.complaintText)
    const encodedFirData = encodeURIComponent(JSON.stringify(formData))
    setTimeout(() => {
      setIsGeneratingAI(false)
      router.push(`/police/ai-suggestions?complaint=${encodedComplaint}&firData=${encodedFirData}`)
    }, 1000)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="shadow-lg rounded-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                <User className="h-5 w-5 text-blue-600" />
                <span>Complainant Details</span>
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                Please provide information about the person filing the FIR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complainantName">Name *</Label>
                  <Input
                    id="complainantName"
                    value={formData.complainantName}
                    onChange={(e) => handleInputChange('complainantName', e.target.value)}
                    placeholder="Enter full name"
                    className={`bg-gray-50 border ${errors.complainantName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
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
                    className={`bg-gray-50 border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
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
                    className={`bg-gray-50 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
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
          <Card className="shadow-lg rounded-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Incident Details</span>
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                Provide detailed information about the incident
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incidentDate">Date *</Label>
                  <Input
                    id="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                    className={`bg-gray-50 border ${errors.incidentDate ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
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
                    className={`bg-gray-50 border ${errors.incidentTime ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
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
                      className={`pl-10 bg-gray-50 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-500">{errors.location}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incidentType">Type of Incident *</Label>
                  <Select value={formData.incidentType} onValueChange={(value) => handleInputChange('incidentType', value)}>
                    <SelectTrigger className={`bg-white border ${errors.incidentType ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 rounded mt-1">
                      {incidentTypes.map((type) => (
                        <SelectItem key={type} value={type} className="px-3 py-2 hover:bg-gray-100">{type}</SelectItem>
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
                    className={`bg-gray-50 border ${errors.complaintText ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
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
            <Alert variant="destructive" className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-center space-x-2">
              <Brain className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                AI is analyzing your complaint to suggest relevant legal sections...
              </AlertDescription>
            </Alert>

            <Card className="shadow-lg rounded-lg border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 mb-2">Review & Submit</CardTitle>
                <CardDescription className="text-sm text-gray-600 mb-4">
                  Review all information before submitting the FIR
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                {/* Summary of entered data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600 text-lg">Complainant Information</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><span className="font-medium">Name:</span> {formData.complainantName}</p>
                      <p><span className="font-medium">Contact:</span> {formData.contactNumber}</p>
                      <p><span className="font-medium">Address:</span> {formData.address}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600 text-lg">Incident Information</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><span className="font-medium">Date:</span> {formData.incidentDate}</p>
                      <p><span className="font-medium">Time:</span> {formData.incidentTime}</p>
                      <p><span className="font-medium">Location:</span> {formData.location}</p>
                      <p><span className="font-medium">Type:</span> <Badge variant="secondary">{formData.incidentType}</Badge></p>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                {/* Complaint Text */}
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Complaint Details</h4>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-300 max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{formData.complaintText}</p>
                  </div>
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
      <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register New FIR</h1>
          <p className="text-gray-600 text-sm">Fill in the details to file a First Information Report</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 px-4">
            {/* Step Indicators */}
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center space-x-2">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    currentStep >= step ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step ? <Check className="h-4 w-4" /> : step}
                </div>
                <span className={`text-sm font-medium ${currentStep >= step ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step === 1 ? 'FIR Details' : step === 2 ? 'AI Prediction' : 'Review'}
                </span>
              </div>
            ))}
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {/* Step Description */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Step {currentStep} of {totalSteps}: {currentStep === 1 ? 'FIR Details' : currentStep === 2 ? 'AI Prediction' : 'Review'}
          </p>
        </div>

        {/* Form Content */}
        <div className="mb-8">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          {currentStep === 2 && (
            <Button
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
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

          {currentStep < totalSteps && (
            <Button
              onClick={handleNext}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          {/* Optional: Add a Submit button on the review step */}
          {currentStep === totalSteps && (
            <Button
              onClick={() => alert('FIR submitted!')} // Replace with actual submit logic
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            >
              <Check className="h-4 w-4 mr-2" />
              Submit FIR
            </Button>
          )}
        </div>
      </div>
    </PoliceLayout>
  )
}