import { type NextRequest, NextResponse } from "next/server"
import { getDiscordMessage, downloadFileFromDiscord } from "@/lib/discord"
import { combineFileChunks } from "@/lib/file-utils"

export async function GET(request: NextRequest, { params }: { params: { messageId: string } }) {
  const { messageId } = params

  if (!messageId) {
    return NextResponse.json({ error: "Mesaj kimliği eksik." }, { status: 400 })
  }

  try {
    // İlk olarak, ana mesajı (meta veri mesajını) Discord'dan alın
    const metadataMessage = await getDiscordMessage(messageId)
    console.log("Metadata Text:", metadataMessage)

    if (!metadataMessage || metadataMessage.attachments.length === 0) {
      return NextResponse.json({ error: "Meta veri mesajı bulunamadı veya ekleri yok." }, { status: 404 })
    }

    // Meta veri dosyasını indirin ve içeriğini okuyun
    const metadataAttachment = metadataMessage.attachments[0]
    const metadataResponse = await downloadFileFromDiscord(metadataAttachment.url)
    const metadataText = await metadataResponse.text()
    const fileInfo = JSON.parse(metadataText)

    const { originalFileName, originalFileType, partMessages } = fileInfo

    if (!originalFileName || !originalFileType || !partMessages || !Array.isArray(partMessages)) {
      return NextResponse.json({ error: "Geçersiz dosya meta verileri." }, { status: 400 })
    }

    // Parçaların URL'lerini toplayın
    const chunkUrls = partMessages.sort((a: any, b: any) => a.partIndex - b.partIndex).map((p: any) => p.attachmentUrl)

    // Parçaları birleştirin
    const combinedBlob = await combineFileChunks(chunkUrls, originalFileName, originalFileType)

    // Birleştirilmiş dosyayı yanıt olarak döndürün
    return new NextResponse(combinedBlob, {
      headers: {
        "Content-Type": originalFileType,
        "Content-Disposition": `attachment; filename="${originalFileName}"`,
        "Content-Length": combinedBlob.size.toString(),
      },
    })
  } catch (error: any) {
    console.error("Dosya indirme hatası:", error)
    // Hata bir JSON yanıtıysa, onu doğrudan döndürün
    if (error.message.includes("Discord'a dosya yüklenemedi") || error.message.includes("Discord mesajı alınamadı")) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: error.message || "Dosya indirilirken bir hata oluştu." }, { status: 500 })
  }
}
