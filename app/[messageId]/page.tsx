"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, FileText, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react"

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
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error)
      await sleep(delay)
    }
  }

  throw lastError!
}

interface FilePart {
  partNo: number
  partUrl: string
}

interface FileInfo {
  partCount: number
  filename: string
  hash: string
  parts: FilePart[]
}

export default function FileReconstructorPage() {
  const params = useParams()
  const messageId = params.messageId as string

  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Initializing...")
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [reconstructedFile, setReconstructedFile] = useState<Blob | null>(null)
  const [hashValid, setHashValid] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const parseFileContent = (content: string): FileInfo => {
    const lines = content.trim().split("\n")
    const partCount = Number.parseInt(lines[0])
    const filename = lines[1]
    const hash = lines[2]

    const parts: FilePart[] = []
    for (let i = 3; i < lines.length; i++) {
      try {
        const partData = JSON.parse(lines[i])
        parts.push({
          partNo: partData.partNo,
          partUrl: partData.partUrl,
        })
      } catch (e) {
        console.error("Error parsing part:", lines[i], e)
      }
    }

    return { partCount, filename, hash, parts }
  }

  const downloadPart = async (url: string, partNo: number): Promise<ArrayBuffer> => {
    return retryWithDelay(async () => {
      // Proxy üzerinden indir CORS sorununu çözmek için
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`
      const response = await fetch(proxyUrl)
      if (!response.ok) {
        throw new Error(`Failed to download part ${partNo}: ${response.statusText}`)
      }
      return response.arrayBuffer()
    })
  }

  const calculateSHA256 = async (buffer: ArrayBuffer): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  const fetchDiscordMessage = async (messageId: string): Promise<string> => {
    return retryWithDelay(async () => {
      const response = await fetch(`/api/discord/message/${messageId}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch Discord message")
      }
      const data = await response.json()
      return data.content
    })
  }

  const reconstructFile = async () => {
    if (!messageId) {
      setError("No message ID provided")
      setLoading(false)
      return
    }

    try {
      setStatus("Fetching Discord message...")
      setProgress(5)

      const messageContent = await fetchDiscordMessage(messageId)

      setStatus("Parsing file information...")
      setProgress(10)

      const info = parseFileContent(messageContent)
      setFileInfo(info)

      setStatus(`Downloading ${info.partCount} parts...`)
      setProgress(15)

      // Download all parts
      const partBuffers: ArrayBuffer[] = new Array(info.partCount)
      let completedParts = 0

      const downloadPromises = info.parts.map(async (part) => {
        try {
          const buffer = await downloadPart(part.partUrl, part.partNo)
          partBuffers[part.partNo - 1] = buffer
          completedParts++
          const downloadProgress = 15 + (completedParts / info.partCount) * 70 // 70% for downloads
          setProgress(downloadProgress)
          setStatus(`Downloaded part ${completedParts}/${info.partCount}`)
        } catch (error) {
          throw new Error(`Failed to download part ${part.partNo}: ${error}`)
        }
      })

      await Promise.all(downloadPromises)

      setStatus("Combining parts...")
      setProgress(90)

      // Combine all parts
      const totalSize = partBuffers.reduce((sum, buffer) => sum + buffer.byteLength, 0)
      const combinedBuffer = new ArrayBuffer(totalSize)
      const combinedView = new Uint8Array(combinedBuffer)

      let offset = 0
      for (const buffer of partBuffers) {
        combinedView.set(new Uint8Array(buffer), offset)
        offset += buffer.byteLength
      }

      setStatus("Verifying hash...")
      setProgress(95)

      // Verify hash
      const calculatedHash = await calculateSHA256(combinedBuffer)
      const isHashValid = calculatedHash === info.hash
      setHashValid(isHashValid)

      if (isHashValid) {
        const blob = new Blob([combinedBuffer])
        setReconstructedFile(blob)
        setStatus("File reconstructed successfully!")
      } else {
        setStatus("Hash verification failed!")
        setError("File integrity check failed. The reconstructed file may be corrupted.")
      }

      setProgress(100)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)
      setStatus(`Error: ${errorMessage}`)
      console.error("Reconstruction error:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = () => {
    if (!reconstructedFile || !fileInfo) return

    const url = URL.createObjectURL(reconstructedFile)
    const a = document.createElement("a")
    a.href = url
    a.download = fileInfo.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (messageId) {
      reconstructFile()
    }
  }, [messageId])

  if (!messageId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold">Invalid URL</h2>
              <p className="text-slate-600">Please provide a valid message ID in the URL.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">File Reconstructor</h1>
          <p className="text-slate-600">Reconstructing file from Discord message: {messageId}</p>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Reconstruction Progress
            </CardTitle>
            <CardDescription>Processing multi-part file reconstruction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="flex items-center gap-2 text-sm text-slate-600">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{status}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {fileInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                File Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Filename</label>
                  <p className="font-mono text-sm bg-slate-100 p-2 rounded break-all">{fileInfo.filename}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Parts</label>
                  <p className="font-mono text-sm bg-slate-100 p-2 rounded">{fileInfo.partCount}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Expected Hash (SHA-256)</label>
                <p className="font-mono text-xs bg-slate-100 p-2 rounded break-all">{fileInfo.hash}</p>
              </div>
              {reconstructedFile && (
                <div>
                  <label className="text-sm font-medium text-slate-600">File Size</label>
                  <p className="font-mono text-sm bg-slate-100 p-2 rounded">
                    {(reconstructedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {hashValid !== null && (
          <Alert className={hashValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <div className="flex items-center gap-2">
              {hashValid ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={hashValid ? "text-green-800" : "text-red-800"}>
                {hashValid
                  ? "Hash verification successful! File integrity confirmed."
                  : "Hash verification failed! File may be corrupted."}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {reconstructedFile && hashValid && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">File Ready for Download</h3>
                  <p className="text-sm text-slate-600">
                    {fileInfo?.filename} • {(reconstructedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button onClick={downloadFile} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download File
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
