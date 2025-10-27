import { NextRequest, NextResponse } from 'next/server'

// Mock feedback storage (in production, use database)
const feedbackStorage: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Filter feedback based on query parameters
    let filteredFeedback = feedbackStorage
    
    if (status) {
      filteredFeedback = filteredFeedback.filter((feedback: any) => feedback.status === status)
    }
    
    if (type) {
      filteredFeedback = filteredFeedback.filter((feedback: any) => feedback.feedbackType === type)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex)

    // Calculate statistics
    const stats = {
      total: feedbackStorage.length,
      accurate: feedbackStorage.filter((f: any) => f.feedbackType === 'accurate').length,
      partiallyCorrect: feedbackStorage.filter((f: any) => f.feedbackType === 'partially-correct').length,
      incorrect: feedbackStorage.filter((f: any) => f.feedbackType === 'incorrect').length,
      averageRating: feedbackStorage.length > 0 
        ? feedbackStorage.reduce((sum: number, f: any) => sum + f.rating, 0) / feedbackStorage.length 
        : 0
    }

    return NextResponse.json({
      success: true,
      data: paginatedFeedback,
      stats,
      pagination: {
        page,
        limit,
        total: filteredFeedback.length,
        totalPages: Math.ceil(filteredFeedback.length / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['firId', 'feedbackType', 'rating']
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate feedback type
    const validTypes = ['accurate', 'partially-correct', 'incorrect']
    if (!validTypes.includes(body.feedbackType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid feedback type' },
        { status: 400 }
      )
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Generate feedback ID
    const feedbackId = `FB-${String(feedbackStorage.length + 1).padStart(3, '0')}`
    
    // Create new feedback
    const newFeedback = {
      id: feedbackId,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Store feedback (in production, save to database)
    feedbackStorage.push(newFeedback)

    // Update AI model accuracy metrics (in production, this would trigger model retraining)
    const accuracyUpdate = await updateAIModelAccuracy(body.feedbackType)

    return NextResponse.json({
      success: true,
      data: newFeedback,
      accuracyUpdate,
      message: 'Feedback submitted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}

async function updateAIModelAccuracy(feedbackType: string) {
  // In production, this would:
  // 1. Update model performance metrics
  // 2. Trigger model retraining if accuracy drops below threshold
  // 3. Log feedback for model improvement
  
  const metrics = {
    feedbackType,
    timestamp: new Date().toISOString(),
    modelVersion: '1.0.0',
    accuracyImpact: feedbackType === 'accurate' ? 'positive' : 'negative'
  }

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 100))

  return {
    metrics,
    updated: true,
    message: 'Model accuracy metrics updated'
  }
}