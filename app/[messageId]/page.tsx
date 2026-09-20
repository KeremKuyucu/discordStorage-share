import { notFound } from "next/navigation"
import SharePageClient from "./share-page-client"

interface PageProps {
  params: Promise<{ messageId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { messageId } = await params
  return {
    title: `Paylaşılan Dosya — DiscordStorage`,
    description: `Bir dosya sizinle paylaşıldı. ID: ${messageId}`,
  }
}

export default async function SharePage({ params }: PageProps) {
  const { messageId } = await params

  // Sadece sayısal ID'ler geçerlidir (Discord snowflake formatı)
  if (!messageId || !/^\d+$/.test(messageId)) {
    notFound()
  }

  return <SharePageClient messageId={messageId} />
}
