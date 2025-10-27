import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Create a specialized prompt for legal awareness
    const systemPrompt = `You are a helpful legal awareness assistant for Indian citizens. Your role is to:
1. Provide basic information about legal rights and procedures
2. Explain FIR filing processes in simple terms
3. Give general guidance on common legal issues
4. Always recommend consulting with qualified lawyers for specific legal advice
5. Provide emergency helpline numbers when relevant
6. Keep responses simple, clear, and actionable
7. Focus on Indian law and procedures

Important: Always include a disclaimer that this is general information and not legal advice. For specific cases, always recommend consulting a qualified lawyer or visiting the nearest police station.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'Unable to generate response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'I apologize, but I\'m having trouble processing your request right now. Please try again later or contact your nearest police station for immediate assistance.'
      },
      { status: 500 }
    )
  }
}