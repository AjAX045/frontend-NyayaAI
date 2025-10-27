import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const firData = await request.json()
    
    const {
      complaintText,
      aiPredictions = [],
      manualSections = [],
      selectedSections = [],
      aiFeedbacks = [], // New field for AI training data
      complainantName,
      contactNumber,
      address,
      incidentDate,
      incidentTime,
      location,
      incidentType
    } = firData

    // Validate required fields
    if (!complaintText || !complainantName || !contactNumber) {
      return NextResponse.json(
        { error: 'Missing required FIR information' },
        { status: 400 }
      )
    }

    // Generate FIR number
    const firNumber = generateFIRNumber()

    // Create FIR record
    const fir = await db.fIR.create({
      data: {
        firNumber,
        complaintText,
        complainantName,
        contactNumber,
        address: address || '',
        incidentDate: incidentDate || '',
        incidentTime: incidentTime || '',
        location: location || '',
        incidentType: incidentType || 'Other',
        status: 'pending'
      }
    })

    // Save legal sections (both AI predictions and manual sections)
    const legalSectionsToSave = selectedSections.map((section: any) => ({
      firId: fir.id,
      sectionNumber: section.sectionNumber,
      title: section.title,
      description: section.description || section.editedContent || '',
      category: section.category,
      punishment: section.punishment || '',
      confidence: section.isManual ? null : section.confidence,
      isManual: section.isManual || false,
      isSelected: true,
      feedbackType: section.officerAction || (section.isManual ? 'manual' : null),
      officerFeedback: section.feedbackNotes || null,
      originalAiPrediction: section.correctedSection ? section.sectionNumber : null
    }))

    if (legalSectionsToSave.length > 0) {
      await db.legalSection.createMany({
        data: legalSectionsToSave
      })
    }

    // Save AI feedback data for model training
    if (aiFeedbacks.length > 0) {
      const aiFeedbackDataToSave = aiFeedbacks.map((feedback: any) => {
        const originalPrediction = aiPredictions.find((p: any) => p.id === feedback.predictionId)
        const correctedPrediction = selectedSections.find((s: any) => s.id === feedback.predictionId && s.correctedSection)
        
        return {
          firId: fir.id,
          complaintText,
          aiPredictedSection: originalPrediction?.sectionNumber || '',
          aiConfidence: originalPrediction?.confidence || 0,
          officerAction: feedback.action,
          correctedSection: feedback.correctedSection || correctedPrediction?.correctedSection || null,
          feedbackNotes: feedback.feedbackNotes || null,
          originalDescription: originalPrediction?.description || null,
          correctedDescription: correctedPrediction?.description || null
        }
      }).filter(f => f.aiPredictedSection) // Only save feedback for actual AI predictions

      if (aiFeedbackDataToSave.length > 0) {
        await db.aIFeedback.createMany({
          data: aiFeedbackDataToSave
        })
      }
    }

    return NextResponse.json({
      success: true,
      firId: fir.id,
      firNumber: fir.firNumber,
      message: 'FIR saved successfully',
      feedbackSaved: aiFeedbacks.length > 0
    })

  } catch (error) {
    console.error('Save FIR error:', error)
    return NextResponse.json(
      { error: 'Failed to save FIR' },
      { status: 500 }
    )
  }
}

function generateFIRNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  // Generate a random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000)
  
  return `FIR/${year}/${month}${day}/${random}`
}

// GET endpoint to retrieve FIRs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const whereClause = status ? { status } : {}

    const firs = await db.fIR.findMany({
      where: whereClause,
      include: {
        legalSections: {
          orderBy: { createdAt: 'asc' }
        },
        officer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await db.fIR.count({ where: whereClause })

    return NextResponse.json({
      success: true,
      firs,
      total,
      hasMore: offset + limit < total
    })

  } catch (error) {
    console.error('Get FIRs error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve FIRs' },
      { status: 500 }
    )
  }
}