interface DiscordNotificationData {
  name: string
  intention: string
  role?: string
  roleOther?: string
  memberNumber: number
}

export async function sendDiscordNotification(data: DiscordNotificationData) {
  const webhookUrl = process.env.DISCORD_URL_WEBHOOK

  if (!webhookUrl) {
    console.warn('Discord webhook URL not configured')
    return
  }

  try {
    // 1. DETERMINAR TEXTO DEL ROL
    let roleText: string

    if (data.intention === 'observer') {
      roleText = 'Observer'
    } else {
      if (data.role === 'other' && data.roleOther) {
        roleText = data.roleOther
      } else {
        const roleMap: Record<string, string> = {
          'marketer': 'Marketer',
          'designer': 'Designer',
          'frontend': 'Frontend Developer',
          'backend': 'Backend Developer',
          'devops': 'DevOps'
        }
        roleText = roleMap[data.role || ''] || data.role || 'Participant'
      }
    }

    // 2. CREAR MENSAJE EMBED
    const embed = {
      title: "🎉 New Team Member!",
      description: `**${data.name}** has joined as **${roleText}**`,
      color: data.intention === 'observer' ? 0x3498db : 0x2ecc71, // Azul o verde
      footer: {
        text: `Levante Project #${data.memberNumber}`
      }
    }

    const message = {
      embeds: [embed]
    }

    // 3. ENVIAR A DISCORD
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      console.error('Failed to send Discord notification:', response.statusText)
    } else {
      console.log('Discord notification sent successfully')
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error)
  }
}

interface DiscordFeedbackData {
  content: string
  authorName?: string | null
  feedbackId: string
}

export async function sendDiscordFeedback(data: DiscordFeedbackData) {
  const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('Discord webhook URL not configured')
    return
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.levanteapp.com";
    const feedbackUrl = `${appUrl}/feedback`;

    const embed = {
      title: "💬 New Feedback Received",
      description: data.content,
      color: 0x9b59b6, // Purple
      fields: [
        {
          name: "Author",
          value: data.authorName || "Anonymous",
          inline: true
        },
        {
          name: "Action",
          value: `[Dar like](${feedbackUrl})`,
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Levante Feedback Wall"
      }
    }

    const message = {
      embeds: [embed]
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      console.error('Failed to send Discord feedback notification:', response.statusText)
    } else {
      console.log('Discord feedback notification sent successfully')
    }
  } catch (error) {
    console.error('Error sending Discord feedback notification:', error)
  }
}
