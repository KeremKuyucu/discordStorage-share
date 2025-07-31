export const MAX_FILE_SIZE_SINGLE_UPLOAD = 3 * 1024 * 1024 // 3 MB
export const CHUNK_SIZE = 3 * 1024 * 1024 // 3 MB
export const MAX_FILE_SIZE_MULTIPART_UPLOAD = 25 * 1024 * 1024 * 1024 // 25 GB (Discord'un 25MB sınırı nedeniyle bu değer teoriktir, ancak parçalı yükleme için daha büyük bir toplam boyutu destekleyebiliriz)
export const DISCORD_MAX_FILE_SIZE = 25 * 1024 * 1024 // Discord'un tekli dosya yükleme sınırı 25 MB
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || ""
export const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || ""
