"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowRight } from "lucide-react"

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

export default function HomePage() {
  const [messageId, setMessageId] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageId.trim()) {
      router.push(`/${messageId.trim()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <FileText className="h-12 w-12 text-slate-700 mx-auto" />
          <h1 className="text-3xl font-bold text-slate-900">File Reconstructor</h1>
          <p className="text-slate-600">Enter a Discord message ID to reconstruct the multi-part file</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Access File</CardTitle>
            <CardDescription>Enter the Discord message ID containing the file information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Message ID</label>
                <Input
                  value={messageId}
                  onChange={(e) => setMessageId(e.target.value)}
                  placeholder="Enter Discord message ID"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={!messageId.trim()}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Access File
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600 space-y-2">
              <p className="font-medium">Direct URL Access:</p>
              <p>You can also access files directly via:</p>
              <code className="block bg-white p-2 rounded text-xs">example.com/[message-id]</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
