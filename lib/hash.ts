/**
 * Calculates the SHA-256 hash of an ArrayBuffer.
 * @param data The ArrayBuffer to hash.
 * @returns A Promise that resolves with the SHA-256 hash as a hexadecimal string.
 */
export async function calculateSha256(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hexHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hexHash
}
