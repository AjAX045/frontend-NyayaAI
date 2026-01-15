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
  status: 'pending' | 'solved'
}

export default function PoliceDashboard({ searchQuery = '' }) {
  const [stats, setStats] = useState({
    totalFIRs: 0,
    pendingFIRs: 0,
    solvedFIRs: 0
  })
  const [recentFIRs, setRecentFIRs] = useState<FIRData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      // 1. Fetch stats
      const statsRes = await fetch(
        'http://localhost:8081/api/police/dashboard/stats'
      )
      const statsData = await statsRes.json()

      setStats({
        totalFIRs: statsData.totalFirs,
        pendingFIRs: statsData.pendingFirs,
        solvedFIRs: statsData.solvedFirs
      })

      // 2. Fetch recent FIRs (API we will create next)
      const recentRes = await fetch(
        'http://localhost:8081/api/police/dashboard/recent-firs'
      )
      const recentData = await recentRes.json()

      const mappedRecentFIRs: FIRData[] = recentData.map((fir: any) => ({
        id: String(fir.id),
        complainant: fir.complainantName,
        type: fir.incidentType,
        date: fir.createdAt
        ? new Date(fir.createdAt).toLocaleDateString('en-IN')
        : '—',


        status: fir.status === 'SOLVED' ? 'solved' : 'pending'
      }))

      setRecentFIRs(mappedRecentFIRs)
    } catch (error) {
      console.error('Dashboard API error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  fetchDashboardData()
}, [])

  const handleChangeStatus = async (id: string, status: 'PENDING' | 'SOLVED') => {
  try {
    const res = await fetch(`http://localhost:8081/api/police/dashboard/fir/${id}/status?status=${status}`, {
      method: 'PATCH'
    });

    if (!res.ok) throw new Error('Failed to update status');

    // Update local state to reflect change immediately
    setRecentFIRs((prev) =>
      prev.map((fir) =>
        fir.id === id ? { ...fir, status: status.toLowerCase() as 'pending' | 'solved' } : fir
      )
    );


    // Update dashboard stats too
    const statsRes = await fetch('http://localhost:8081/api/police/dashboard/stats');
    const statsData = await statsRes.json();
    setStats({
      totalFIRs: statsData.totalFirs,
      pendingFIRs: statsData.pendingFirs,
      solvedFIRs: statsData.solvedFirs
    });

  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update FIR status');
  }
};



  const getStatusBadge = (status: 'pending' | 'solved') => {
    return status === 'solved'
      ? 'bg-green-100 text-green-800 hover:bg-green-100'
      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
  }


  const getStatusIcon = (status: 'pending' | 'solved') => {
   return status === 'solved'
    ? <CheckCircle className="h-4 w-4 text-green-600" />
    : <Clock className="h-4 w-4 text-yellow-600" />
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
  const fetchAllFIRs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/police/dashboard/all-firs');
      const data = await res.json();

      // Map backend data to FIRData interface
      const firs: FIRData[] = data.map((fir: any) => ({
        id: fir.id.toString(),
        complainant: fir.complainantName,
        type: fir.incidentType,
        status: fir.status || 'pending', // fallback if status empty
        date: fir.createdAt
      }));

      setRecentFIRs(firs); // reuse the same table
    } catch (error) {
      console.error('Error fetching all FIRs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFIRs = recentFIRs.filter((fir) => {
   const q = searchQuery.toLowerCase()

    return (
      fir.id.toString().includes(q) ||
      fir.complainant.toLowerCase().includes(q) ||
      fir.type.toLowerCase().includes(q)
    )
  })



  return (
     <PoliceLayout>
      <div className="p-6">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Officer Ajay</h1>
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
              <div className="text-2xl font-bold text-orange-600">{stats.pendingFIRs}</div>
              <p className="text-xs text-gray-600 mt-1">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Solved FIRs</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.solvedFIRs}</div>
              <p className="text-xs text-gray-600 mt-1">FIRs solved</p>
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
              <Button
                onClick={() => fetchAllFIRs()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                View All FIRs
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
                            <DropdownMenuItem onClick={() => handleChangeStatus(fir.id, 'PENDING')}>
                              <Clock className="mr-2 h-4 w-4" />
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeStatus(fir.id, 'SOLVED')}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Solved
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
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