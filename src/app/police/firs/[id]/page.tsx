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
  AlertCircle
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

  // Extract data safely
  const {
    id,
    complainantName,
    complainantPhone,
    complainantAddress,
    incidentType,
    incidentDate,
    incidentTime,
    location,
    status,
    createdAt,
    complaintText,
    predictedSections // JSON string usually
  } = firData

  let sectionsArray = [];
  try {
    if (predictedSections) {
      sectionsArray = typeof predictedSections === 'string' 
        ? JSON.parse(predictedSections) 
        : predictedSections;
    }
  } catch (e) {
    console.error("Error parsing sections");
  }

  const isSolved = status === 'SOLVED';

  return (
    <PoliceLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">FIR Details</h1>
                <Badge variant={isSolved ? "default" : "secondary"} className={isSolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                  {isSolved ? "Solved" : "Pending"}
                </Badge>
              </div>
              <p className="text-gray-500">ID: {id}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link href="/police/register-fir">
              <Button variant="outline">Print FIR</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Incident Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Incident Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Incident Type</p>
                    <p className="text-lg font-semibold">{incidentType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date & Time</p>
                    <p>{incidentDate} at {incidentTime}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{location}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Complaint Description</p>
                  <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-800 leading-relaxed">
                    {complaintText || "No description provided."}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Sections */}
            {sectionsArray && sectionsArray.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scale className="h-5 w-5 text-purple-600" />
                    <span>Applied Legal Sections</span>
                  </CardTitle>
                  <CardDescription>
                    Sections applied to this FIR based on AI analysis or officer review
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sectionsArray.map((sec: any, idx: number) => (
                      <div key={idx} className="flex items-start space-x-3 p-3 bg-purple-50 rounded border border-purple-100">
                        <div className="font-bold text-purple-700">
                          {sec.sectionNumber}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{sec.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{sec.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Info */}
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
                  <p className="font-semibold text-gray-900">{complainantPhone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-sm text-gray-900">{complainantAddress || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* FIR Status Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Status & Timeline</CardTitle>
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
                    <span className="text-sm font-medium capitalize">{status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PoliceLayout>
  )
}