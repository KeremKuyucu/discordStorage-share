import { type NextRequest, NextResponse } from "next/server"
import { getDiscordMessage } from "@/lib/discord"
import { DISCORD_CHANNEL_ID, DISCORD_BOT_TOKEN } from "@/lib/constants"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> },
) {
  try {
    const { messageId } = await params

    if (!DISCORD_BOT_TOKEN) {
      console.error("DISCORD_BOT_TOKEN environment variable is not configured")
      return NextResponse.json(
        { error: "Discord bot token not configured. Please set DISCORD_BOT_TOKEN." },
        { status: 500, headers: CORS_HEADERS },
      )
    }

    if (!DISCORD_CHANNEL_ID) {
      console.error("DISCORD_CHANNEL_ID environment variable is not configured")
      return NextResponse.json(
        { error: "Discord channel ID not configured. Please set DISCORD_CHANNEL_ID." },
        { status: 500, headers: CORS_HEADERS },
      )
    }

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400, headers: CORS_HEADERS },
      )
    }

    console.log(`Fetching Discord message ${messageId} from channel ${DISCORD_CHANNEL_ID}`)

    // lib/discord.ts'deki ortak fonksiyonu kullan
    const messageData = await getDiscordMessage(messageId, DISCORD_CHANNEL_ID)

    if (!messageData.attachments || messageData.attachments.length === 0) {
      return NextResponse.json(
        { error: "Message has no attachments" },
        { status: 400, headers: CORS_HEADERS },
      )
    }

    const attachment = messageData.attachments[0]

    if (!attachment.filename.endsWith(".txt")) {
      return NextResponse.json(
        { error: "Only .txt files are supported in this endpoint." },
        { status: 400, headers: CORS_HEADERS },
      )
    }

    console.log(`Fetching attachment: ${attachment.filename}`)

    // Attachment içeriğini indir — exponential backoff ile
    const content = await fetchWithRetry(attachment.url)

    return NextResponse.json(
      {
        content,
        filename: attachment.filename,
        size: attachment.size,
        messageId,
        channelId: DISCORD_CHANNEL_ID,
      },
      { headers: CORS_HEADERS },
    )
  } catch (error) {
    console.error("Discord API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    const status = errorMessage.includes("not found") ? 404 : 500
    return NextResponse.json({ error: errorMessage }, { status, headers: CORS_HEADERS })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

// Exponential backoff ile URL fetch — rate limit ve geçici ağ hatalarına karşı
async function fetchWithRetry(url: string, maxRetries = 3): Promise<string> {
  let lastError: Error = new Error("Unknown error")

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      })

      if (response.status === 429) {
        // Rate limited — retry-after başlığına bak, yoksa exponential backoff
        const retryAfter = response.headers.get("Retry-After")
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000
        console.warn(`Rate limited, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`)
        await sleep(delay)
        continue
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch attachment: ${response.status} ${response.statusText}`)
      }

      return await response.text()
    } catch (error) {
      lastError = error as Error
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 500
        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error)
        await sleep(delay)
      }
    }
  }

  throw lastError
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
