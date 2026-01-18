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

export default function PoliceDashboard() {
  const [stats, setStats] = useState({
    totalFIRs: 0,
    pendingFIRs: 0,
    solvedFIRs: 0
  })

  const [searchInput, setSearchInput] = useState('')
  const [recentFIRs, setRecentFIRs] = useState<FIRData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await fetch(
          'http://localhost:8081/api/police/dashboard/stats'
        )
        const statsData = await statsRes.json()

        setStats({
          totalFIRs: statsData.totalFirs,
          pendingFIRs: statsData.pendingFirs,
          solvedFIRs: statsData.solvedFirs
        })

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
      await fetch(`http://localhost:8081/api/police/dashboard/fir/${id}/status?status=${status}`, {
        method: 'PATCH'
      })

      setRecentFIRs(prev =>
        prev.map(fir =>
          fir.id === id ? { ...fir, status: status.toLowerCase() as 'pending' | 'solved' } : fir
        )
      )

      const statsRes = await fetch('http://localhost:8081/api/police/dashboard/stats')
      const statsData = await statsRes.json()
      setStats({
        totalFIRs: statsData.totalFirs,
        pendingFIRs: statsData.pendingFirs,
        solvedFIRs: statsData.solvedFirs
      })

    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update FIR status')
    }
  }

  const filteredFIRs = recentFIRs.filter((fir) => {
    const q = searchInput.toLowerCase()
    return (
      fir.id.toString().includes(q) ||
      fir.complainant.toLowerCase().includes(q) ||
      fir.type.toLowerCase().includes(q)
    )
  })

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
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="loading-shimmer h-32 rounded-lg"></Card>
            ))}
          </div>
          <Card className="loading-shimmer h-96 rounded-lg"></Card>
        </div>
      </PoliceLayout>
    )
  }

  return (
    <PoliceLayout>
      <div className="p-6 space-y-8">
        {/* Welcome Message */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome, Officer Ajay</h1>
          <p className="text-gray-600 text-sm md:text-base">Here's your dashboard overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Total FIRs Filed', icon: <FileText className="h-4 w-4 text-blue-600" />, value: stats.totalFIRs.toLocaleString(), description: 'All time records' },
            { title: 'Pending Review', icon: <Clock className="h-4 w-4 text-orange-500" />, value: stats.pendingFIRs, description: 'Requires attention' },
            { title: 'Solved FIRs', icon: <MessageSquare className="h-4 w-4 text-green-500" />, value: stats.solvedFIRs, description: 'FIRs solved' }
          ].map((card) => (
            <Card key={card.title} className="hover:shadow-xl transition-shadow rounded-lg">
              <CardHeader className="flex items-center justify-between pb-2 px-4 pt-4">
                <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl md:text-3xl font-bold">{card.value}</div>
                <p className="text-xs mt-1 text-gray-500">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Register New FIR Button */}
        <div className="mb-8">
          <Link href="/police/register-fir">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Register New FIR
            </Button>
          </Link>
        </div>

        {/* Recent FIRs Table */}
        <Card className="rounded-lg shadow-lg border border-gray-200">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-4">
            <div>
              <CardTitle className="text-xl font-semibold mb-1">Recent FIRs</CardTitle>
              <CardDescription className="text-gray-500 text-sm">Latest filed First Information Reports</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-auto">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search ID, Name, Type..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 pr-4 w-full sm:w-[250px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <Link href="/police/all-firs">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                  View All FIRs
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto rounded-b-lg">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-gray-50">
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
                  {filteredFIRs.length > 0 ? (
                    filteredFIRs.map((fir) => (
                      <TableRow key={fir.id} className="hover:bg-gray-100 transition duration-200 cursor-pointer">
                        <TableCell className="font-medium">{fir.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`/avatars/${fir.complainant.toLowerCase().replace(' ', '-')}.png`} />
                              <AvatarFallback className="text-xs">{fir.complainant.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span>{fir.complainant}</span>
                          </div>
                        </TableCell>
                        <TableCell>{fir.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(fir.status)}
                            <Badge className={`${getStatusBadge(fir.status)} text-xs`}>
                              {fir.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{fir.date}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 transition rounded">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-lg shadow-lg border border-gray-200 p-2">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleChangeStatus(fir.id, 'PENDING')}>
                                <Clock className="mr-2 h-4 w-4" />
                                Mark as Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeStatus(fir.id, 'SOLVED')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Solved
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/police/firs/${fir.id}`} className="cursor-pointer flex items-center p-2 hover:bg-gray-100 rounded">
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        No FIRs found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </PoliceLayout>
  )
}