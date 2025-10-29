export async function submitQuestionnaire(data: {
  name: string
  linkedin?: string
  intention: string
  role?: string
  roleOther?: string
  experience?: string
  timeCommitment?: string
  completedPath: string
}) {
  try {
    const response = await fetch('/api/questionnaire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to submit questionnaire')
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting questionnaire:', error)
    throw error
  }
}
