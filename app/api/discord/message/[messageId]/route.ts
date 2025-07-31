import { type NextRequest, NextResponse } from "next/server"

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const DISCORD_CHANNEL_ID = "1400517269670330507" // Fixed channel ID

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const retryWithDelay = async <T,>(fn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> => {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (attempt === maxRetries) {
        throw lastError
      }
      console.warn(`Discord API attempt ${attempt} failed, retrying in ${delay}ms...`, error)
      await sleep(delay)
    }
  }

  throw lastError!
}

export async function GET(request: NextRequest, { params }: { params: { messageId: string } }) {
  // CORS headers ekle
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  }

  try {
    const { messageId } = params

    if (!DISCORD_BOT_TOKEN) {
      console.error("DISCORD_BOT_TOKEN environment variable is not configured")
      return NextResponse.json(
        {
          error: "Discord bot token not configured. Please set the DISCORD_BOT_TOKEN environment variable.",
        },
        { status: 500, headers },
      )
    }

    if (!messageId) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400, headers })
    }

    console.log(`Fetching Discord message ${messageId} from channel ${DISCORD_CHANNEL_ID}`)

    // Fetch message from Discord API with retry logic
    const discordResponse = await retryWithDelay(async () => {
      const response = await fetch(`https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages/${messageId}`, {
        method: "GET",
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
          "User-Agent": "DiscordBot (https://discord.js.org, 1.0.0)",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Discord API Error: ${response.status} ${response.statusText}`, errorText)

        if (response.status === 404) {
          throw new Error("Message not found")
        }
        if (response.status === 403) {
          throw new Error("Bot doesn't have permission to access this channel")
        }
        if (response.status === 401) {
          throw new Error("Invalid bot token")
        }
        if (response.status === 429) {
          // Rate limited - throw error to trigger retry
          throw new Error("Rate limited by Discord API")
        }
        throw new Error(`Discord API error: ${response.status} ${response.statusText}`)
      }

      return response
    })

    const messageData = await discordResponse.json()

    // Check if message has attachments
    if (!messageData.attachments || messageData.attachments.length === 0) {
      return NextResponse.json({ error: "Message has no attachments" }, { status: 400, headers })
    }

    // Get the first attachment (assuming it contains the file info)
    const attachment = messageData.attachments[0]

    console.log(`Fetching attachment: ${attachment.filename}`)

    // Fetch the attachment content with retry logic
    const attachmentResponse = await retryWithDelay(async () => {
      const response = await fetch(attachment.url, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch attachment: ${response.status} ${response.statusText}`)
      }
      return response
    })

    const content = await attachmentResponse.text()

    return NextResponse.json(
      {
        content,
        filename: attachment.filename,
        size: attachment.size,
        messageId: messageId,
        channelId: DISCORD_CHANNEL_ID,
      },
      { headers },
    )
  } catch (error) {
    console.error("Discord API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: 500, headers })
  }
}

// OPTIONS method for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
