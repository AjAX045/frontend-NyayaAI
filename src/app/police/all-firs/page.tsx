'use client'

import { useState, useEffect } from 'react'
import PoliceLayout from '@/components/police-layout'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  Filter,
  MoreHorizontal,
  Eye,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { useRouter } from 'next/navigation'

interface FIRData {
  id: string
  complainant: string
  type: string
  date: string
  status: 'pending' | 'solved'
}

export default function AllFIRs() {
  const [allFIRs, setAllFIRs] = useState<FIRData[]>([])
  const [filteredFIRs, setFilteredFIRs] = useState<FIRData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchAllFIRs()
  }, [])

  useEffect(() => {
    const lowerQ = searchQuery.toLowerCase()
    const filtered = allFIRs.filter((fir) => 
      fir.id.includes(lowerQ) || 
      fir.complainant.toLowerCase().includes(lowerQ) || 
      fir.type.toLowerCase().includes(lowerQ)
    )
    setFilteredFIRs(filtered)
  }, [searchQuery, allFIRs])

  const fetchAllFIRs = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('http://localhost:8081/api/police/dashboard/all-firs');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      const mappedFIRs: FIRData[] = data.map((fir: any) => ({
        id: fir.id.toString(),
        complainant: fir.complainantName,
        type: fir.incidentType,
        status: fir.status === 'SOLVED' ? 'solved' : 'pending',
        date: fir.createdAt ? new Date(fir.createdAt).toLocaleDateString('en-IN') : '—',
      }));

      setAllFIRs(mappedFIRs)
    } catch (error) {
      console.error('Error fetching all FIRs:', error);
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'solved'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
  }

  return (
    <PoliceLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All FIR Records</h1>
            <p className="text-gray-600">View and manage all filed First Information Reports</p>
          </div>
          <Link href="/police">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by ID, Complainant, or Type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredFIRs.length} of {allFIRs.length} records
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-600 mb-4" />
                <p>Loading all records...</p>
              </div>
            ) : (
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
                  {filteredFIRs.length > 0 ? (
                    filteredFIRs.map((fir) => (
                      <TableRow key={fir.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{fir.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {fir.complainant.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{fir.complainant}</span>
                          </div>
                        </TableCell>
                        <TableCell>{fir.type}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadge(fir.status)} text-xs`}>
                            {fir.status.replace('-', ' ')}
                          </Badge>
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
                              <DropdownMenuItem asChild>
                                <Link href={`/police/firs/${fir.id}`} className="cursor-pointer flex items-center">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PoliceLayout>
  )
}