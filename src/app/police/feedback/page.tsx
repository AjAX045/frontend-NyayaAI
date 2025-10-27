'use client'

import { useState } from 'react'
import PoliceLayout from '@/components/police-layout'
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  AlertCircle, 
  CheckCircle,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  Send,
  RefreshCw,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

interface FeedbackItem {
  id: string
  firId: string
  complainant: string
  incidentType: string
  predictedSections: string[]
  finalSections: string[]
  feedbackType: 'accurate' | 'partially-correct' | 'incorrect'
  rating: number
  remarks: string
  date: string
  status: 'pending' | 'reviewed' | 'implemented'
}

export default function PoliceFeedback() {
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([
    {
      id: 'FB-001',
      firId: 'FIR-2024-001',
      complainant: 'Rahul Sharma',
      incidentType: 'Theft',
      predictedSections: ['Section 379', 'Section 380'],
      finalSections: ['Section 379', 'Section 381'],
      feedbackType: 'partially-correct',
      rating: 3,
      remarks: 'AI missed Section 381 which was more relevant',
      date: '2024-01-15',
      status: 'reviewed'
    },
    {
      id: 'FB-002',
      firId: 'FIR-2024-002',
      complainant: 'Priya Patel',
      incidentType: 'Assault',
      predictedSections: ['Section 354', 'Section 506'],
      finalSections: ['Section 354', 'Section 506'],
      feedbackType: 'accurate',
      rating: 5,
      remarks: 'Perfect prediction by AI system',
      date: '2024-01-14',
      status: 'implemented'
    },
    {
      id: 'FB-003',
      firId: 'FIR-2024-003',
      complainant: 'Amit Kumar',
      incidentType: 'Fraud',
      predictedSections: ['Section 420'],
      finalSections: ['Section 420', 'Section 468'],
      feedbackType: 'partially-correct',
      rating: 4,
      remarks: 'Good prediction but missed related sections',
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: 'FB-004',
      firId: 'FIR-2024-004',
      complainant: 'Sneha Reddy',
      incidentType: 'Harassment',
      predictedSections: ['Section 509'],
      finalSections: ['Section 354', 'Section 509'],
      feedbackType: 'incorrect',
      rating: 2,
      remarks: 'AI failed to identify the primary offense',
      date: '2024-01-13',
      status: 'reviewed'
    }
  ])

  const [newFeedback, setNewFeedback] = useState({
    firId: '',
    feedbackType: '',
    rating: 5,
    remarks: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const handleSubmitFeedback = async () => {
    if (!newFeedback.firId || !newFeedback.feedbackType) return

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      const feedback: FeedbackItem = {
        id: `FB-${String(feedbackData.length + 1).padStart(3, '0')}`,
        firId: newFeedback.firId,
        complainant: 'John Doe',
        incidentType: 'General',
        predictedSections: ['Section 123'],
        finalSections: ['Section 123', 'Section 124'],
        feedbackType: newFeedback.feedbackType as any,
        rating: newFeedback.rating,
        remarks: newFeedback.remarks,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      }
      
      setFeedbackData(prev => [feedback, ...prev])
      setNewFeedback({ firId: '', feedbackType: '', rating: 5, remarks: '' })
      setIsSubmitting(false)
    }, 1500)
  }

  const getFeedbackTypeColor = (type: string) => {
    switch (type) {
      case 'accurate': return 'bg-green-100 text-green-800'
      case 'partially-correct': return 'bg-yellow-100 text-yellow-800'
      case 'incorrect': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-100 text-green-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'accurate': return <ThumbsUp className="h-4 w-4 text-green-600" />
      case 'partially-correct': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'incorrect': return <ThumbsDown className="h-4 w-4 text-red-600" />
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const filteredFeedback = feedbackData.filter(item => {
    const matchesSearch = item.firId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.complainant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || item.feedbackType === filterType
    return matchesSearch && matchesFilter
  })

  const accuracyRate = Math.round(
    (feedbackData.filter(f => f.feedbackType === 'accurate').length / feedbackData.length) * 100
  )

  return (
    <PoliceLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Feedback for Model Improvement</h1>
          <p className="text-gray-600">Rate AI prediction accuracy to help improve the system</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedbackData.length}</div>
              <p className="text-xs text-gray-600 mt-1">All time submissions</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Accuracy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{accuracyRate}%</div>
              <Progress value={accuracyRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {feedbackData.filter(f => f.status === 'pending').length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Implemented</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {feedbackData.filter(f => f.status === 'implemented').length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Changes applied</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="feedback-list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="feedback-list">Feedback History</TabsTrigger>
            <TabsTrigger value="submit-feedback">Submit Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="feedback-list" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by FIR ID or complainant..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 text-gray-900">
                      <SelectItem value="all" className="text-gray-900 focus:bg-gray-100">All Types</SelectItem>
                      <SelectItem value="accurate" className="text-gray-900 focus:bg-gray-100">Accurate</SelectItem>
                      <SelectItem value="partially-correct" className="text-gray-900 focus:bg-gray-100">Partially Correct</SelectItem>
                      <SelectItem value="incorrect" className="text-gray-900 focus:bg-gray-100">Incorrect</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Table */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback History</CardTitle>
                <CardDescription>Review all submitted feedback on AI predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>FIR ID</TableHead>
                      <TableHead>Complainant</TableHead>
                      <TableHead>Incident Type</TableHead>
                      <TableHead>Feedback</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedback.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{item.firId}</TableCell>
                        <TableCell>{item.complainant}</TableCell>
                        <TableCell>{item.incidentType}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getFeedbackIcon(item.feedbackType)}
                            <Badge className={getFeedbackTypeColor(item.feedbackType)}>
                              {item.feedbackType.replace('-', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {renderStars(item.rating)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Feedback</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Mark as Reviewed</DropdownMenuItem>
                              <DropdownMenuItem>Implement Changes</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submit-feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Feedback</CardTitle>
                <CardDescription>
                  Provide feedback on AI predictions to help improve the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firId">FIR ID *</Label>
                    <Input
                      id="firId"
                      value={newFeedback.firId}
                      onChange={(e) => setNewFeedback(prev => ({ ...prev, firId: e.target.value }))}
                      placeholder="e.g., FIR-2024-001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedbackType">Feedback Type *</Label>
                    <Select value={newFeedback.feedbackType} onValueChange={(value) => setNewFeedback(prev => ({ ...prev, feedbackType: value }))}>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                        <SelectValue placeholder="Select feedback type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 text-gray-900">
                        <SelectItem value="accurate" className="text-gray-900 focus:bg-gray-100">Accurate</SelectItem>
                        <SelectItem value="partially-correct" className="text-gray-900 focus:bg-gray-100">Partially Correct</SelectItem>
                        <SelectItem value="incorrect" className="text-gray-900 focus:bg-gray-100">Incorrect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewFeedback(prev => ({ ...prev, rating: star }))}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= newFeedback.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {newFeedback.rating} out of 5
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={newFeedback.remarks}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, remarks: e.target.value }))}
                    placeholder="Provide detailed feedback about the AI prediction..."
                    rows={4}
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your feedback helps improve AI accuracy for future predictions. All feedback is reviewed by our team.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setNewFeedback({ firId: '', feedbackType: '', rating: 5, remarks: '' })}>
                    Clear
                  </Button>
                  <Button 
                    onClick={handleSubmitFeedback}
                    disabled={!newFeedback.firId || !newFeedback.feedbackType || isSubmitting}
                    className="hover-lift"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PoliceLayout>
  )
}