'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PoliceLayout from '@/components/police-layout'
import { 
  ArrowLeft, 
  FileText, 
  User, 
  MapPin, 
  Calendar,
  Scale,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  Users,
  Building2,
  Shield,
  Download // <--- ADD THIS
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function FIRDetails() {
  const params = useParams()
  const router = useRouter()
  const firId = params.id as string

  const [firData, setFirData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFIRDetails()
  }, [firId])

  const fetchFIRDetails = async () => {
    setLoading(true)
    try {
      // Attempt 1: Try specific ID endpoint
      let res;
      try {
         res = await fetch(`http://localhost:8081/api/police/firs/${firId}`);
         if (res.ok) {
           const data = await res.json();
           setFirData(data);
           setLoading(false);
           return;
         }
      } catch (e) {
         console.log("Specific endpoint failed, trying fallback...")
      }

      // Attempt 2: Fallback (Get all and filter)
      const allRes = await fetch('http://localhost:8081/api/police/dashboard/all-firs');
      if (!allRes.ok) throw new Error('Failed to load FIR data');
      const allData = await allRes.json();
      
      const foundFIR = allData.find((f: any) => f.id.toString() === firId);
      if (foundFIR) {
        setFirData(foundFIR);
      } else {
        setError('FIR not found');
      }

    } catch (err) {
      console.error(err);
      setError('Failed to load FIR details');
    } finally {
      setLoading(false)
    }
  }

    const handleDownloadPDF = async () => {
    try {
      // Using the same base URL as your other fetch calls
      const response = await fetch(`http://localhost:8081/api/firs/${firId}/pdf`);
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      // Convert the response to a Blob (file-like object)
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary invisible anchor tag to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `FIR_${firId}.pdf`; // Set the filename
      
      // Append to body, click, and remove
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      // Release the object URL
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Could not download the PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <PoliceLayout>
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-600 mb-4" />
            <p>Loading FIR Details...</p>
          </div>
        </div>
      </PoliceLayout>
    )
  }

  if (error || !firData) {
    return (
      <PoliceLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{error || 'FIR not found'}</p>
              <Link href="/police">
                <Button>Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </PoliceLayout>
    )
  }

  // Extract data safely with updated backend field names
  const {
    id,
    district,
    policeStation,
    complainantName,
    contactNumber, 
    address,       
    occupation,
    relationToVictim,
    incidentType,
    incidentDate,
    incidentTime,
    location,
    placeOfOccurrence,
    status,
    createdAt,
    complaintText,
    predictedSections,
    accusedList
  } = firData

  // FIX: Explicitly type as any[] to avoid 'never[]' error
  let sectionsArray: any[] = []; 
  
  try {
    if (predictedSections) {
      const parsed = typeof predictedSections === 'string' 
        ? JSON.parse(predictedSections) 
        : predictedSections;
      if (Array.isArray(parsed)) {
        sectionsArray = parsed;
      }
    }
  } catch (e) {
    console.error("Error parsing sections", e);
  }

  const isSolved = status === 'SOLVED';

  return (
    <PoliceLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">FIR Details</h1>
                <Badge variant={isSolved ? "default" : "secondary"} className={isSolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                  {isSolved ? "Solved" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span>ID: {id}</span>
                {district && <span>• {district} District</span>}
                {policeStation && <span>• {policeStation}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              Print FIR
            </Button>
            
            {/* NEW DOWNLOAD BUTTON */}
            <Button 
              onClick={handleDownloadPDF} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Incident Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Incident Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Incident Type</p>
                    <p className="text-lg font-semibold">{incidentType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date & Time</p>
                    <p>{incidentDate} at {incidentTime}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Location (City/Area)</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{location}</p>
                    </div>
                  </div>
                  {/* New Field */}
                  {placeOfOccurrence && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Exact Place of Occurrence</p>
                      <p className="text-gray-900 mt-1">{placeOfOccurrence}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Complaint Description</p>
                  <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                    {complaintText || "No description provided."}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Sections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scale className="h-5 w-5 text-purple-600" />
                  <span>Applied Legal Sections</span>
                </CardTitle>
                <CardDescription>
                  IPC sections applied based on complaint analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sectionsArray && sectionsArray.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {sectionsArray.map((sec: any, idx: number) => {
                      // Handle if it's a simple string (e.g., "IPC 366") or an object
                      const sectionLabel = typeof sec === 'string' ? sec : (sec.sectionNumber || sec.title || 'Unknown Section');
                      return (
                        <Badge key={idx} variant="outline" className="px-3 py-1 text-sm border-purple-200 text-purple-800 bg-purple-50">
                          {sectionLabel}
                        </Badge>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No legal sections applied yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Accused List Card (New) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-red-600" />
                  <span>Accused Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {accusedList && accusedList.length > 0 ? (
                  <div className="space-y-4">
                    {accusedList.map((accused: any, idx: number) => (
                      <div key={idx} className="flex items-start justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                        <div>
                          <p className="font-bold text-gray-900">{accused.name || 'Unknown Name'}</p>
                          <p className="text-sm text-gray-600 mt-1 max-w-md">{accused.address || 'No address provided'}</p>
                        </div>
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          Accused #{idx + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No accused listed in this FIR.</p>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Sidebar Info */}
          <div className="space-y-6">
            
            {/* Complainant Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-green-600" />
                  <span>Complainant</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="font-semibold text-gray-900">{complainantName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p className="font-semibold text-gray-900">{contactNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-sm text-gray-900 break-words">{address || 'N/A'}</p>
                </div>
                {/* New Fields */}
                {(occupation || relationToVictim) && <Separator />}
                {occupation && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Occupation</p>
                    <p className="text-sm text-gray-900">{occupation}</p>
                  </div>
                )}
                {relationToVictim && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Relation to Victim</p>
                    <p className="text-sm text-gray-900">{relationToVictim}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FIR Status Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Status & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Filed On</span>
                  <span className="text-sm font-medium">
                    {createdAt ? new Date(createdAt).toLocaleDateString('en-IN') : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Current Status</span>
                  <div className="flex items-center space-x-1">
                    {isSolved ? <CheckCircle className="h-4 w-4 text-green-600"/> : <Clock className="h-4 w-4 text-yellow-600"/>}
                    <span className="text-sm font-medium capitalize">{status || 'Pending'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Police Station Info (New) */}
            {(district || policeStation) && (
              <Card className="bg-blue-50 border-blue-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
                    <Building2 className="h-4 w-4" />
                    Jurisdiction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {policeStation && (
                    <div>
                      <span className="text-blue-600 font-medium">Station:</span> {policeStation}
                    </div>
                  )}
                  {district && (
                    <div>
                      <span className="text-blue-600 font-medium">District:</span> {district}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </PoliceLayout>
  )
}