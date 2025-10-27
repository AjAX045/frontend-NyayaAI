import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Mock FIR storage (in production, use database)
const firStorage: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Filter FIRs based on query parameters
    let filteredFirs = firStorage
    
    if (status) {
      filteredFirs = filteredFirs.filter((fir: any) => fir.status === status)
    }
    
    if (type) {
      filteredFirs = filteredFirs.filter((fir: any) => fir.incidentType === type)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedFirs = filteredFirs.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedFirs,
      pagination: {
        page,
        limit,
        total: filteredFirs.length,
        totalPages: Math.ceil(filteredFirs.length / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FIRs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['complainantName', 'contactNumber', 'incidentType', 'complaintText']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Generate FIR ID
    const firId = `FIR-${new Date().getFullYear()}-${String(firStorage.length + 1).padStart(3, '0')}`
    
    // Create new FIR
    const newFIR = {
      id: firId,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Store FIR (in production, save to database)
    firStorage.push(newFIR)

    return NextResponse.json({
      success: true,
      data: newFIR,
      message: 'FIR created successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create FIR' },
      { status: 500 }
    )
  }
}