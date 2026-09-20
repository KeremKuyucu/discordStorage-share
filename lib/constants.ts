export const MAX_FILE_SIZE_SINGLE_UPLOAD = 10 * 1024 * 1024 // 10 MB (Discord bot upload limit)
export const CHUNK_SIZE = 10 * 1024 * 1024 // 10 MB per chunk
export const MAX_FILE_SIZE_MULTIPART_UPLOAD = 1 * 1024 * 1024 * 1024 // 1 GB total (chunked upload)
export const DISCORD_MAX_FILE_SIZE = 10 * 1024 * 1024 // Discord bot single file upload limit: 10 MB
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || ""
export const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || ""
