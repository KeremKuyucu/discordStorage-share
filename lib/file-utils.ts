import { CHUNK_SIZE } from "./constants"
import { sha256 } from "js-sha256"

export function calculateFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer
      const hash = sha256.arrayBuffer(buffer)
      resolve(
        Array.from(new Uint8Array(hash))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
      )
    }
    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file)
  })
}

export function splitFileIntoChunks(file: File): Blob[] {
  const chunks: Blob[] = []
  let offset = 0
  while (offset < file.size) {
    const chunk = file.slice(offset, offset + CHUNK_SIZE)
    chunks.push(chunk)
    offset += CHUNK_SIZE
  }
  return chunks
}

export async function combineFileChunks(
  chunkUrls: string[],
  originalFileName: string,
  originalFileType: string,
): Promise<Blob> {
  const parts: Blob[] = []
  for (const url of chunkUrls) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Parça indirilemedi: ${url} - ${response.statusText}`)
    }
    parts.push(await response.blob())
  }
  return new Blob(parts, { type: originalFileType })
}
