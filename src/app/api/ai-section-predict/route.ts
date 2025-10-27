import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  let complaintText: string = ''
  
  try {
    const body = await request.json()
    complaintText = body.complaintText

    if (!complaintText || typeof complaintText !== 'string') {
      return NextResponse.json(
        { error: 'Complaint text is required' },
        { status: 400 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Create AI prompt for section prediction
    const prompt = `You are a legal AI assistant specializing in Indian law (Bharatiya Nyaya Sanhita, 2023). Based on the following complaint text, identify the most relevant legal sections that could apply.

Complaint: "${complaintText}"

Please analyze the complaint and provide:
1. The most relevant BNS section numbers
2. Section titles
3. Brief descriptions
4. Confidence levels (0-100%)
5. Potential punishments
6. Categories of offenses

Format your response as a JSON array with the following structure:
[
  {
    "sectionNumber": "Section XXX",
    "title": "Section title",
    "description": "Brief description of the section",
    "confidence": 85,
    "punishment": "Potential punishment",
    "category": "Category of offense"
  }
]

Focus on the most relevant sections (maximum 5) and provide realistic confidence scores based on how well the complaint matches the legal provisions.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a legal AI assistant specializing in Indian law. Always respond with valid JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })

    const aiResponse = completion.choices[0]?.message?.content
    
    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Try to parse the AI response as JSON
    let predictions
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse
      predictions = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // Fallback to mock predictions if parsing fails
      predictions = getFallbackPredictions(complaintText)
    }

    // Validate and format predictions
    const formattedPredictions = predictions.map((pred: any, index: number) => ({
      id: String(index + 1),
      sectionNumber: pred.sectionNumber || `Section ${100 + index}`,
      title: pred.title || 'Legal Provision',
      description: pred.description || 'Description of the legal provision',
      confidence: Math.min(100, Math.max(0, parseInt(pred.confidence) || 75)),
      punishment: pred.punishment || 'As per legal provisions',
      category: pred.category || 'Legal Offense'
    }))

    return NextResponse.json({
      success: true,
      predictions: formattedPredictions,
      complaintText
    })

  } catch (error) {
    console.error('AI section prediction error:', error)
    
    // Return fallback predictions on error
    const fallbackPredictions = getFallbackPredictions(complaintText || '')
    
    return NextResponse.json({
      success: true,
      predictions: fallbackPredictions,
      complaintText: complaintText || '',
      fallback: true
    })
  }
}

function getFallbackPredictions(complaintText: string) {
  // Basic keyword-based fallback predictions
  const text = complaintText.toLowerCase()
  const predictions: any[] = []

  if (text.includes('theft') || text.includes('stolen')) {
    predictions.push({
      id: '1',
      sectionNumber: 'Section 303',
      title: 'Theft',
      description: 'Whoever dishonestly moves any property existing in moveable form, whether for himself or for any other person, without the consent of the person to whom such property belongs, commits theft.',
      confidence: 85,
      punishment: 'Imprisonment up to 3 years, fine, or both',
      category: 'Property Offense'
    })
  }

  if (text.includes('assault') || text.includes('attack') || text.includes('hit')) {
    predictions.push({
      id: '2',
      sectionNumber: 'Section 351',
      title: 'Assault',
      description: 'Whoever makes any gesture or preparation intending or knowing it to be likely to cause any person to apprehend that he is about to use criminal force to that person, is said to commit assault.',
      confidence: 80,
      punishment: 'Imprisonment up to 3 months, fine up to ₹500, or both',
      category: 'Physical Offense'
    })
  }

  if (text.includes('harassment') || text.includes('eve teasing')) {
    predictions.push({
      id: '3',
      sectionNumber: 'Section 79',
      title: 'Sexual harassment of woman at workplace',
      description: 'Sexual harassment of any woman at workplace by any person is an offense.',
      confidence: 90,
      punishment: 'Rigorous imprisonment up to 3 years, fine, or both',
      category: 'Offense against Women'
    })
  }

  if (text.includes('fraud') || text.includes('cheat') || text.includes('deceive')) {
    predictions.push({
      id: '4',
      sectionNumber: 'Section 316',
      title: 'Cheating',
      description: 'Whoever fraudulently or dishonestly deceives any person and thereby induces him to deliver any property or do anything which he would not do if not so deceived, commits cheating.',
      confidence: 75,
      punishment: 'Imprisonment up to 3 years, fine, or both',
      category: 'Financial Offense'
    })
  }

  if (text.includes('threat') || text.includes('intimidate')) {
    predictions.push({
      id: '5',
      sectionNumber: 'Section 351',
      title: 'Criminal intimidation',
      description: 'Whoever threatens to cause injury to any person or property, with intent to cause alarm or to cause that person to do any act which he is not legally bound to do.',
      confidence: 70,
      punishment: 'Imprisonment up to 2 years, fine, or both',
      category: 'Intimidation'
    })
  }

  // If no specific matches, provide general predictions
  if (predictions.length === 0) {
    predictions.push({
      id: '1',
      sectionNumber: 'Section 83',
      title: 'Public nuisance',
      description: 'Any act which causes any common injury, danger or annoyance to the public or to the people in general who live or occupy property in the vicinity.',
      confidence: 60,
      punishment: 'Fine up to ₹200 or imprisonment up to 3 months',
      category: 'Public Order'
    })
  }

  return predictions.slice(0, 5) // Limit to 5 predictions
}