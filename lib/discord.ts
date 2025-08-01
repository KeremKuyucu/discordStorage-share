import { DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID } from "./constants"

interface DiscordAttachment {
  id: string
  filename: string
  size: number
  url: string
  proxy_url: string
}

interface DiscordMessage {
  id: string
  channel_id: string
  guild_id?: string
  author: {
    id: string
    username: string
    discriminator: string
    avatar: string
  }
  content: string
  timestamp: string
  attachments: DiscordAttachment[]
}

export async function uploadFileToDiscord(
  file: Blob | Buffer,
  filename: string,
  channelId: string = DISCORD_CHANNEL_ID,
): Promise<DiscordMessage> {
  if (!DISCORD_BOT_TOKEN) {
    throw new Error("DISCORD_BOT_TOKEN ortam değişkeni ayarlanmamış.")
  }
  if (!channelId) {
    throw new Error("Discord kanal kimliği sağlanmadı.")
  }

  const formData = new FormData()
  formData.append("file", file, filename)

  const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Discord'a dosya yüklenirken hata:", errorText)
    throw new Error(`Discord'a dosya yüklenemedi: ${response.status} ${response.statusText} - ${errorText}`)
  }

  return response.json()
}

export async function getDiscordMessage(
  messageId: string,
  channelId: string = DISCORD_CHANNEL_ID,
): Promise<DiscordMessage> {
  if (!DISCORD_BOT_TOKEN) {
    throw new Error("DISCORD_BOT_TOKEN ortam değişkeni ayarlanmamış.")
  }
  if (!channelId) {
    throw new Error("Discord kanal kimliği sağlanmadı.")
  }

  const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Discord mesajı alınırken hata:", errorText)
    throw new Error(`Discord mesajı alınamadı: ${response.status} ${response.statusText} - ${errorText}`)
  }

  return response.json()
}

export async function downloadFileFromDiscord(url: string): Promise<Response> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Discord'dan dosya indirilemedi: ${response.status} ${response.statusText}`)
  }
  return response
}
