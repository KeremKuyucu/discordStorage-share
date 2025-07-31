import { type NextRequest, NextResponse } from "next/server"
import { uploadFileToDiscord } from "@/lib/discord"
import { CHUNK_SIZE } from "@/lib/constants"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const filePart = formData.get("filePart") as File | null
    const fileName = formData.get("fileName") as string | null
    const partIndex = formData.get("partIndex") as string | null
    const totalParts = formData.get("totalParts") as string | null
    const fileHash = formData.get("fileHash") as string | null

    if (!filePart || !fileName || partIndex === null || totalParts === null || !fileHash) {
      return NextResponse.json({ error: "Eksik form verisi." }, { status: 400 })
    }

    if (filePart.size > CHUNK_SIZE) {
      return NextResponse.json(
        {
          error: `Parça boyutu sınırı aşıyor. Maksimum ${CHUNK_SIZE / (1024 * 1024)} MB.`,
        },
        { status: 413 },
      )
    }

    const buffer = Buffer.from(await filePart.arrayBuffer())
    const discordMessage = await uploadFileToDiscord(buffer, `${fileName}.part${partIndex}`)

    return NextResponse.json({
      message: `Parça ${partIndex}/${totalParts} başarıyla yüklendi.`,
      partIndex: Number.parseInt(partIndex),
      messageId: discordMessage.id,
      attachmentUrl: discordMessage.attachments[0]?.url,
      fileHash: fileHash,
    })
  } catch (error: any) {
    console.error("Parça yükleme hatası:", error)
    return NextResponse.json({ error: error.message || "Dosya parçası yüklenirken bir hata oluştu." }, { status: 500 })
  }
}
