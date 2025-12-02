import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { QuestionnaireResponse } from '@/lib/supabase/database.types'
import { sendDiscordNotification } from '@/lib/discord'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 1. VALIDACIÓN DE CAMPOS REQUERIDOS
    if (!body.name || !body.intention || !body.completedPath) {
      return NextResponse.json(
        { error: 'Name, intention, and completed path are required' },
        { status: 400 }
      )
    }

    // 2. VALIDACIÓN DE VALORES PERMITIDOS
    if (!['active', 'observer'].includes(body.intention)) {
      return NextResponse.json(
        { error: 'Invalid intention value' },
        { status: 400 }
      )
    }

    if (!['full', 'observer'].includes(body.completedPath)) {
      return NextResponse.json(
        { error: 'Invalid completed path value' },
        { status: 400 }
      )
    }

    // 3. VALIDACIÓN DE LINKEDIN URL
    if (body.linkedin && body.linkedin.trim() && !body.linkedin.includes('linkedin.com')) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn URL' },
        { status: 400 }
      )
    }

    // 4. VALIDACIÓN DE ROL (si es active debe tener rol)
    if (body.intention === 'active' && body.completedPath === 'full') {
      if (!body.role) {
        return NextResponse.json(
          { error: 'Role is required for active participants' },
          { status: 400 }
        )
      }

      const validRoles = ['marketer', 'designer', 'frontend', 'backend', 'devops', 'other']
      if (!validRoles.includes(body.role)) {
        return NextResponse.json(
          { error: 'Invalid role value' },
          { status: 400 }
        )
      }

      // Si el rol es 'other', debe proporcionar roleOther
      if (body.role === 'other' && !body.roleOther?.trim()) {
        return NextResponse.json(
          { error: 'Please specify your role when selecting "other"' },
          { status: 400 }
        )
      }
    }

    // 5. VALIDACIÓN DE EXPERIENCIA (si es active debe tener experiencia)
    if (body.intention === 'active' && body.completedPath === 'full') {
      if (!body.experience) {
        return NextResponse.json(
          { error: 'Experience level is required for active participants' },
          { status: 400 }
        )
      }

      const validExperience = ['beginner', 'intermediate', 'advanced', 'none']
      if (!validExperience.includes(body.experience)) {
        return NextResponse.json(
          { error: 'Invalid experience value' },
          { status: 400 }
        )
      }
    }

    // 6. VALIDACIÓN DE TIME COMMITMENT (si es active debe tener time commitment)
    if (body.intention === 'active' && body.completedPath === 'full') {
      if (!body.timeCommitment) {
        return NextResponse.json(
          { error: 'Time commitment is required for active participants' },
          { status: 400 }
        )
      }

      const validTimeCommitments = ['1-3', '4-8', '9-15', '15+']
      if (!validTimeCommitments.includes(body.timeCommitment)) {
        return NextResponse.json(
          { error: 'Invalid time commitment value' },
          { status: 400 }
        )
      }
    }

    // 7. PREPARACIÓN DE DATOS
    const questionnaireData: QuestionnaireResponse = {
      name: body.name.trim(),
      linkedin: body.linkedin?.trim() || null,
      intention: body.intention,
      role: body.role || null,
      role_other: body.roleOther?.trim() || null,
      experience: body.experience || null,
      time_commitment: body.timeCommitment || null,
      completed_path: body.completedPath,
    }

    // 8. INSERCIÓN EN SUPABASE
    const { data, error } = (await supabaseAdmin
      .from('questionnaire_responses')
      .insert(questionnaireData as any)
      .select()
      .single()) as { data: any; error: any }

    if (error) {
      console.error('Supabase error:', error)

      // Manejo de LinkedIn duplicado
      if (error.code === '23505' && error.message.includes('idx_questionnaire_linkedin_unique')) {
        return NextResponse.json(
          { error: 'This LinkedIn profile has already been registered' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to save questionnaire response' },
        { status: 500 }
      )
    }

    // 9. CONTEO DE MIEMBROS
    const { count } = await supabaseAdmin
      .from('questionnaire_responses')
      .select('*', { count: 'exact', head: true })

    const memberNumber = (count || 0)

    // 10. NOTIFICACIÓN A DISCORD
    try {
      await sendDiscordNotification({
        name: questionnaireData.name,
        intention: questionnaireData.intention,
        role: questionnaireData.role || undefined,
        roleOther: questionnaireData.role_other || undefined,
        memberNumber: memberNumber
      })
    } catch (discordError) {
      console.error('Failed to send Discord notification:', discordError)
      // No fallar la request si Discord falla
    }

    // 11. RESPUESTA EXITOSA
    return NextResponse.json(
      {
        message: 'Questionnaire response saved successfully',
        id: (data as any).id,
        memberNumber: memberNumber
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
