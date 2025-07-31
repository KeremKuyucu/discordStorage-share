import { type NextRequest, NextResponse } from "next/server"
import { uploadFileToDiscord } from "@/lib/discord"
import { MAX_FILE_SIZE_SINGLE_UPLOAD } from "@/lib/constants"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE_SINGLE_UPLOAD) {
      return NextResponse.json(
        {
          error: `Dosya boyutu sınırı aşıyor. Maksimum ${MAX_FILE_SIZE_SINGLE_UPLOAD / (1024 * 1024)} MB.`,
        },
        { status: 413 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const discordMessage = await uploadFileToDiscord(file, file.name)

    return NextResponse.json({
      message: "Dosya başarıyla yüklendi.",
      fileId: discordMessage.id,
      fileName: discordMessage.attachments[0]?.filename,
      fileSize: discordMessage.attachments[0]?.size,
      fileUrl: discordMessage.attachments[0]?.url,
    })
  } catch (error: any) {
    console.error("Dosya yükleme hatası:", error)
    return NextResponse.json({ error: error.message || "Dosya yüklenirken bir hata oluştu." }, { status: 500 })
  }
}
