'use client'

import { useState, useEffect } from 'react'
import PoliceLayout from '@/components/police-layout'
import { 
  FileText, 
  Clock, 
  MessageSquare, 
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface FIRData {
  id: string
  complainant: string
  type: string
  date: string
  status: 'pending' | 'under-review' | 'resolved'
}

export default function PoliceDashboard() {
  const [stats, setStats] = useState({
    totalFIRs: 0,
    pendingReviews: 0,
    feedbackSubmitted: 0
  })
  const [recentFIRs, setRecentFIRs] = useState<FIRData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setStats({
        totalFIRs: 1247,
        pendingReviews: 23,
        feedbackSubmitted: 156
      })
      
      setRecentFIRs([
        {
          id: 'FIR-2024-001',
          complainant: 'Rahul Sharma',
          type: 'Theft',
          date: '2024-01-15',
          status: 'pending'
        },
        {
          id: 'FIR-2024-002',
          complainant: 'Priya Patel',
          type: 'Assault',
          date: '2024-01-14',
          status: 'under-review'
        },
        {
          id: 'FIR-2024-003',
          complainant: 'Amit Kumar',
          type: 'Fraud',
          date: '2024-01-14',
          status: 'resolved'
        },
        {
          id: 'FIR-2024-004',
          complainant: 'Sneha Reddy',
          type: 'Harassment',
          date: '2024-01-13',
          status: 'pending'
        },
        {
          id: 'FIR-2024-005',
          complainant: 'Vikram Singh',
          type: 'Property Dispute',
          date: '2024-01-13',
          status: 'under-review'
        }
      ])
      setIsLoading(false)
    }, 1500)
  }, [])

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      'under-review': 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      'resolved': 'bg-green-100 text-green-800 hover:bg-green-100'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'under-review':
        return <AlertTriangle className="h-4 w-4 text-blue-600" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <PoliceLayout>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="loading-shimmer h-32"></Card>
            ))}
          </div>
          <Card className="loading-shimmer h-96"></Card>
        </div>
      </PoliceLayout>
    )
  }

  return (
    <PoliceLayout>
      <div className="p-6">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Officer Smith</h1>
          <p className="text-gray-600">Here's your dashboard overview</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total FIRs Filed</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFIRs.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">All time records</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</div>
              <p className="text-xs text-gray-600 mt-1">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Feedback Submitted</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.feedbackSubmitted}</div>
              <p className="text-xs text-gray-600 mt-1">AI improvements</p>
            </CardContent>
          </Card>
        </div>

        {/* Register New FIR Button */}
        <div className="mb-8">
          <Link href="/police/register-fir">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Register New FIR
            </Button>
          </Link>
        </div>

        {/* Recent FIRs Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Recent FIRs</CardTitle>
                <CardDescription>Latest filed First Information Reports</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>FIR ID</TableHead>
                    <TableHead>Complainant</TableHead>
                    <TableHead>Complaint Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Filed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentFIRs.map((fir) => (
                    <TableRow key={fir.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{fir.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`/avatars/${fir.complainant.toLowerCase().replace(' ', '-')}.png`} />
                            <AvatarFallback className="text-xs">
                              {fir.complainant.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{fir.complainant}</span>
                        </div>
                      </TableCell>
                      <TableCell>{fir.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(fir.status)}
                          <Badge className={`${getStatusBadge(fir.status)} text-xs`}>
                            {fir.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{fir.date}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit FIR
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PoliceLayout>
  )
}