'use client'

import { useState } from 'react'
import PoliceLayout from '@/components/police-layout'
import { 
  User, MapPin, Calendar, Clock, FileText, Brain,
  ChevronLeft, ChevronRight, Check, AlertCircle, Loader2, Plus, Trash2, Building2
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

// Updated Interface to include all backend required fields
interface Accused {
  name: string
  address: string
}

interface FormData {
  // FIR Basic Details
  district: string
  policeStation: string

  // Complainant Details
  complainantName: string
  contactNumber: string
  address: string
  occupation: string
  relationToVictim: string
  
  // Incident Details
  incidentDate: string
  incidentTime: string
  location: string
  placeOfOccurrence: string
  incidentType: string
  complaintText: string
  
  // System / AI
  predictedSections?: string // Added to match backend structure
  accusedList: Accused[]
}

const incidentTypes = [
  'Theft', 'Assault', 'Fraud', 'Harassment', 'Property Dispute', 
  'Cyber Crime', 'Domestic Violence', 'Traffic Accident', 'Sexual Offence', 'Other'
]

export default function RegisterFIR() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize state with new fields
  const [formData, setFormData] = useState<FormData>({
    // FIR Basic Details
    district: '',
    policeStation: '',
    
    // Complainant Details
    complainantName: '',
    contactNumber: '',
    address: '',
    occupation: '',
    relationToVictim: '',
    
    // Incident Details
    incidentDate: '',
    incidentTime: '',
    location: '',
    placeOfOccurrence: '',
    incidentType: '',
    complaintText: '',

    // System
    accusedList: [],
    predictedSections: ''
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

  // --- Accused List Handlers ---
  const addAccused = () => {
    setFormData(prev => ({
      ...prev,
      accusedList: [...prev.accusedList, { name: '', address: '' }]
    }))
  }

  const removeAccused = (index: number) => {
    setFormData(prev => ({
      ...prev,
      accusedList: prev.accusedList.filter((_, i) => i !== index)
    }))
  }

  const handleAccusedChange = (index: number, field: keyof Accused, value: string) => {
    const newAccusedList = [...formData.accusedList]
    newAccusedList[index][field] = value
    setFormData(prev => ({ ...prev, accusedList: newAccusedList }))
  }
  // ----------------------------

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      // Validate FIR Basic Details
      if (!formData.district.trim()) newErrors.district = 'District is required'
      if (!formData.policeStation.trim()) newErrors.policeStation = 'Police Station is required'
      
      // Validate Complainant Details
      if (!formData.complainantName.trim()) newErrors.complainantName = 'Name is required'
      if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required'
      else if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = 'Invalid phone number'
      if (!formData.address.trim()) newErrors.address = 'Address is required'
    }

    if (step === 2) {
      // Validate Incident Details
      if (!formData.incidentDate) newErrors.incidentDate = 'Incident date is required'
      if (!formData.incidentTime) newErrors.incidentTime = 'Incident time is required'
      if (!formData.location.trim()) newErrors.location = 'Location is required'
      if (!formData.placeOfOccurrence.trim()) newErrors.placeOfOccurrence = 'Place of occurrence is required'
      if (!formData.incidentType) newErrors.incidentType = 'Incident type is required'
      if (!formData.complaintText.trim()) newErrors.complaintText = 'Complaint details are required'

      // Validate Accused Details (Ensure if added, they have names)
      formData.accusedList.forEach((accused, index) => {
        if (!accused.name.trim()) {
          newErrors[`accusedName_${index}`] = 'Name is required'
        }
      })
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
    // Simulate AI processing and navigate (preserving existing flow)
    const encodedComplaint = encodeURIComponent(formData.complaintText)
    const encodedFirData = encodeURIComponent(JSON.stringify(formData))
    
    setTimeout(() => {
      setIsGeneratingAI(false)
      router.push(`/police/ai-suggestions?complaint=${encodedComplaint}&firData=${encodedFirData}`)
    }, 1000)
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) return // Final validation before submit
    
    setIsSubmitting(true)

    // Format time to HH:MM:SS as required by Spring Boot LocalTime
    const formattedTime = formData.incidentTime ? formData.incidentTime + ":00" : ""

    // Construct payload exactly as backend expects
    const payload = {
      district: formData.district,
      policeStation: formData.policeStation,
      complainantName: formData.complainantName,
      contactNumber: formData.contactNumber,
      address: formData.address,
      occupation: formData.occupation,
      relationToVictim: formData.relationToVictim,
      incidentDate: formData.incidentDate,
      incidentTime: formattedTime,
      location: formData.location,
      placeOfOccurrence: formData.placeOfOccurrence,
      incidentType: formData.incidentType,
      complaintText: formData.complaintText,
      predictedSections: formData.predictedSections || "", // Ensure field exists
      accusedList: formData.accusedList
    }

    try {
      const response = await fetch('/api/firs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result = await response.json()
        alert('FIR Registered Successfully!')
        // Optionally redirect or reset form
        // router.push('/police/dashboard') 
      } else {
        console.error('Submission failed', await response.text())
        alert('Failed to register FIR. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting FIR:', error)
      alert('An error occurred. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* NEW: FIR Basic Details */}
            <Card className="shadow-lg rounded-lg border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span>FIR Basic Details</span>
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Police station and jurisdiction information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      placeholder="e.g. Bindiya"
                      className={`bg-gray-50 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policeStation">Police Station *</Label>
                    <Input
                      id="policeStation"
                      value={formData.policeStation}
                      onChange={(e) => handleInputChange('policeStation', e.target.value)}
                      placeholder="e.g. Mithi Police Station"
                      className={`bg-gray-50 border ${errors.policeStation ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {errors.policeStation && <p className="text-sm text-red-500">{errors.policeStation}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complainant Details */}
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
                    {errors.complainantName && <p className="text-sm text-red-500">{errors.complainantName}</p>}
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
                    {errors.contactNumber && <p className="text-sm text-red-500">{errors.contactNumber}</p>}
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
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                  </div>
                  
                  {/* NEW FIELDS */}
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      placeholder="e.g. Student, Business"
                      className="bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationToVictim">Relation to Victim</Label>
                    <Input
                      id="relationToVictim"
                      value={formData.relationToVictim}
                      onChange={(e) => handleInputChange('relationToVictim', e.target.value)}
                      placeholder="e.g. Brother, Self, Friend"
                      className="bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            {/* Incident Details */}
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
                    {errors.incidentDate && <p className="text-sm text-red-500">{errors.incidentDate}</p>}
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
                    {errors.incidentTime && <p className="text-sm text-red-500">{errors.incidentTime}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location (City/Area) *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g. Kanpur"
                        className={`pl-10 bg-gray-50 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      />
                    </div>
                    {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                  </div>
                  
                  {/* NEW FIELD */}
                  <div className="space-y-2">
                    <Label htmlFor="placeOfOccurrence">Place of Occurrence *</Label>
                    <Input
                      id="placeOfOccurrence"
                      value={formData.placeOfOccurrence}
                      onChange={(e) => handleInputChange('placeOfOccurrence', e.target.value)}
                      placeholder="Exact place name (e.g. NGO Tribal School)"
                      className={`bg-gray-50 border ${errors.placeOfOccurrence ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    {errors.placeOfOccurrence && <p className="text-sm text-red-500">{errors.placeOfOccurrence}</p>}
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
                    {errors.incidentType && <p className="text-sm text-red-500">{errors.incidentType}</p>}
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
                    {errors.complaintText && <p className="text-sm text-red-500">{errors.complaintText}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NEW: Accused Details */}
            <Card className="shadow-lg rounded-lg border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                      <User className="h-5 w-5 text-blue-600" />
                      <span>Accused Details</span>
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">
                      Add details of the accused person(s)
                    </CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addAccused} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Accused
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                {formData.accusedList.length === 0 ? (
                  <p className="text-sm text-gray-500 italic text-center py-4">No accused added yet. Click "Add Accused" to start.</p>
                ) : (
                  formData.accusedList.map((accused, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">Accused #{index + 1}</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeAccused(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`accusedName_${index}`}>Name *</Label>
                          <Input
                            id={`accusedName_${index}`}
                            value={accused.name}
                            onChange={(e) => handleAccusedChange(index, 'name', e.target.value)}
                            placeholder="Accused full name"
                            className={`bg-white border ${errors[`accusedName_${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {errors[`accusedName_${index}`] && <p className="text-sm text-red-500">{errors[`accusedName_${index}`]}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`accusedAddress_${index}`}>Address</Label>
                          <Input
                            id={`accusedAddress_${index}`}
                            value={accused.address}
                            onChange={(e) => handleAccusedChange(index, 'address', e.target.value)}
                            placeholder="Accused address"
                            className="bg-white border border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
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
              <CardContent className="space-y-6 p-4">
                {/* Section 1: FIR & Complainant */}
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600 text-lg border-b pb-2">FIR & Complainant Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <p><span className="font-medium text-gray-900">District:</span> {formData.district}</p>
                    <p><span className="font-medium text-gray-900">Police Station:</span> {formData.policeStation}</p>
                    <p><span className="font-medium text-gray-900">Complainant:</span> {formData.complainantName}</p>
                    <p><span className="font-medium text-gray-900">Contact:</span> {formData.contactNumber}</p>
                    <p className="md:col-span-2"><span className="font-medium text-gray-900">Address:</span> {formData.address}</p>
                    <p><span className="font-medium text-gray-900">Occupation:</span> {formData.occupation || 'N/A'}</p>
                    <p><span className="font-medium text-gray-900">Relation:</span> {formData.relationToVictim || 'N/A'}</p>
                  </div>
                </div>

                <Separator />

                {/* Section 2: Incident */}
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600 text-lg border-b pb-2">Incident Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <p><span className="font-medium text-gray-900">Date:</span> {formData.incidentDate}</p>
                    <p><span className="font-medium text-gray-900">Time:</span> {formData.incidentTime}</p>
                    <p><span className="font-medium text-gray-900">Location:</span> {formData.location}</p>
                    <p><span className="font-medium text-gray-900">Place of Occurrence:</span> {formData.placeOfOccurrence}</p>
                    <p className="md:col-span-2">
                      <span className="font-medium text-gray-900">Type:</span>{' '}
                      <Badge variant="secondary">{formData.incidentType}</Badge>
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Section 3: Complaint Text */}
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Complaint Details</h4>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-300 max-h-48 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{formData.complaintText}</p>
                  </div>
                </div>

                {/* Section 4: Accused List */}
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Accused List ({formData.accusedList.length})</h4>
                  {formData.accusedList.length > 0 ? (
                    <div className="space-y-2">
                      {formData.accusedList.map((accused, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">{accused.name}</p>
                            <p className="text-xs text-gray-500">{accused.address}</p>
                          </div>
                          <Badge variant="outline">Accused #{index + 1}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No accused listed.</p>
                  )}
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
                  {step === 1 ? 'Details' : step === 2 ? 'Incident' : 'Review'}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Step {currentStep} of {totalSteps}
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
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
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

          {currentStep < totalSteps && currentStep !== 2 && (
            <Button
              onClick={handleNext}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          {/* Submit Button on Review Step */}
          {currentStep === totalSteps && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Submit FIR
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </PoliceLayout>
  )
}