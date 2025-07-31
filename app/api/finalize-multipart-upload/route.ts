import { type NextRequest, NextResponse } from "next/server"
import { uploadFileToDiscord } from "@/lib/discord"
import { Buffer } from "buffer"

interface FinalizeRequest {
  originalFileName: string
  originalFileType: string
  totalParts: number
  fileHash: string
  partMessages: {
    partIndex: number
    messageId: string
    attachmentUrl: string
  }[]
}

export async function POST(req: NextRequest) {
  try {
    const { originalFileName, originalFileType, totalParts, fileHash, partMessages }: FinalizeRequest = await req.json()

    if (
      !originalFileName ||
      !originalFileType ||
      !totalParts ||
      !fileHash ||
      !partMessages ||
      partMessages.length === 0
    ) {
      return NextResponse.json({ error: "Eksik veya geçersiz veri." }, { status: 400 })
    }

    // Parçaların doğru sırada ve eksiksiz olduğundan emin olun
    const sortedPartMessages = partMessages.sort((a, b) => a.partIndex - b.partIndex)
    if (
      sortedPartMessages.length !== totalParts ||
      sortedPartMessages[0].partIndex !== 0 ||
      sortedPartMessages[totalParts - 1].partIndex !== totalParts - 1
    ) {
      return NextResponse.json({ error: "Dosya parçaları eksik veya yanlış sırada." }, { status: 400 })
    }

    // Bu noktada, parçaların Discord'da olduğunu varsayıyoruz.
    // Gerçek bir uygulamada, burada parçaların bütünlüğünü doğrulamak için ek kontroller yapılabilir (örn. hash kontrolü).

    // Ana mesajı Discord'a göndererek dosya bilgilerini kaydedin
    // Bu mesaj, dosyanın yeniden birleştirilmesi için gerekli tüm bilgileri içerecektir.
    const fileInfoContent = JSON.stringify({
      originalFileName,
      originalFileType,
      totalParts,
      fileHash,
      partMessages: sortedPartMessages.map((p) => ({
        partIndex: p.partIndex,
        messageId: p.messageId,
        attachmentUrl: p.attachmentUrl,
      })),
    })

    // Discord'a gönderilecek ana mesajı oluşturun
    // Bu mesaj, dosyanın meta verilerini içerecek ve indirme işlemi için referans noktası olacaktır.
    // Bu mesajı bir dosyaya eklemek yerine, içeriğini doğrudan mesaj olarak gönderiyoruz.
    // Ancak, Discord API'si doğrudan JSON içeriğiyle mesaj göndermeyi desteklemez.
    // Bu nedenle, bu bilgiyi bir dosyaya eklemek yerine, içeriğini doğrudan mesaj olarak gönderelim ve bu mesajın kimliğini döndürelim.
    // Gerçek bir senaryoda, bu meta veriler bir veritabanında saklanabilir.

    // Basitlik adına, bu bilgiyi bir Discord mesajının içeriği olarak gönderelim.
    // Daha sağlam bir çözüm için, bu meta verileri bir veritabanında saklamak veya
    // küçük bir JSON dosyasını Discord'a yüklemek daha iyi olabilir.
    const finalMessage = await uploadFileToDiscord(
      Buffer.from(fileInfoContent, "utf-8"),
      `${originalFileName}.metadata.json`,
    )

    return NextResponse.json({
      message: "Çok parçalı yükleme başarıyla tamamlandı.",
      finalMessageId: finalMessage.id, // Bu mesaj kimliği, dosyanın indirilmesi için kullanılacak
      fileName: originalFileName,
      fileType: originalFileType,
      totalParts: totalParts,
    })
  } catch (error: any) {
    console.error("Çok parçalı yüklemeyi tamamlama hatası:", error)
    return NextResponse.json(
      { error: error.message || "Çok parçalı yükleme tamamlanırken bir hata oluştu." },
      { status: 500 },
    )
  }
}
