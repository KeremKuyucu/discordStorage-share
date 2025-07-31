"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"

export default function ApiDocsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4 dark:bg-gray-900">
      <header className="w-full max-w-4xl text-center mb-8 mt-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">API Dokümantasyonu</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discord Dosya Yöneticisi API'sinin nasıl kullanılacağını öğrenin.
        </p>
        <div className="mt-6">
          <Button asChild variant="outline" className="w-full max-w-xs bg-transparent">
            <Link href="/">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Ana Sayfaya Dön
            </Link>
          </Button>
        </div>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Genel Bakış</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              Bu API, dosyaları Discord'a yüklemenize ve Discord'dan indirmenize olanak tanır. Hem tekli dosya
              yüklemeleri hem de büyük dosyalar için çok parçalı yüklemeler desteklenmektedir.
            </p>
          </CardContent>
        </Card>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="single-upload">
            <AccordionTrigger className="text-xl font-semibold">Tekli Dosya Yükleme</AccordionTrigger>
            <AccordionContent>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      POST
                    </Badge>
                    <code>/api/upload</code>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Tek bir dosyayı Discord'a yükler. Dosya boyutu sınırı 3 MB'tır.
                  </p>
                  <h3 className="font-medium text-lg">İstek</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    <code>Content-Type: multipart/form-data</code>
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    <li>
                      <code>file</code> (File): Yüklenecek dosya.
                    </li>
                  </ul>
                  <h3 className="font-medium text-lg">Yanıt</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-x-auto">
                    <code>
                      {`{
  "message": "Dosya başarıyla yüklendi.",
  "fileId": "string", // Discord mesaj kimliği
  "fileName": "string",
  "fileSize": "number",
  "fileUrl": "string" // Yüklenen dosyanın Discord URL'si
}`}
                    </code>
                  </pre>
                  <h3 className="font-medium text-lg">Hata Yanıtları</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    <li>
                      <code>400 Bad Request</code>: Dosya bulunamadı veya eksik veri.
                    </li>
                    <li>
                      <code>413 Payload Too Large</code>: Dosya boyutu sınırı aşıyor.
                    </li>
                    <li>
                      <code>500 Internal Server Error</code>: Sunucu tarafında bir hata oluştu.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="multipart-upload-part">
            <AccordionTrigger className="text-xl font-semibold">
              Çok Parçalı Dosya Yükleme (Parça Yükleme)
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      POST
                    </Badge>
                    <code>/api/upload-part</code>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Büyük bir dosyanın tek bir parçasını Discord'a yükler. Her parça 3 MB'tan küçük olmalıdır.
                  </p>
                  <h3 className="font-medium text-lg">İstek</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    <code>Content-Type: multipart/form-data</code>
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    <li>
                      <code>filePart</code> (File): Yüklenecek dosya parçası.
                    </li>
                    <li>
                      <code>fileName</code> (string): Orijinal dosyanın adı.
                    </li>
                    <li>
                      <code>partIndex</code> (number): Parçanın sıfır tabanlı indeksi.
                    </li>
                    <li>
                      <code>totalParts</code> (number): Toplam parça sayısı.
                    </li>
                    <li>
                      <code>fileHash</code> (string): Orijinal dosyanın SHA256 hash'i.
                    </li>
                  </ul>
                  <h3 className="font-medium text-lg">Yanıt</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-x-auto">
                    <code>
                      {`{
  "message": "Parça 0/X başarıyla yüklendi.",
  "partIndex": "number",
  "messageId": "string", // Yüklenen parçanın Discord mesaj kimliği
  "attachmentUrl": "string", // Yüklenen parçanın Discord URL'si
  "fileHash": "string"
}`}
                    </code>
                  </pre>
                  <h3 className="font-medium text-lg">Hata Yanıtları</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    <li>
                      <code>400 Bad Request</code>: Eksik form verisi.
                    </li>
                    <li>
                      <code>413 Payload Too Large</code>: Parça boyutu sınırı aşıyor.
                    </li>
                    <li>
                      <code>500 Internal Server Error</code>: Sunucu tarafında bir hata oluştu.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="finalize-multipart-upload">
            <AccordionTrigger className="text-xl font-semibold">
              Çok Parçalı Dosya Yükleme (Sonlandırma)
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      POST
                    </Badge>
                    <code>/api/finalize-multipart-upload</code>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Tüm parçalar yüklendikten sonra çok parçalı yükleme işlemini sonlandırır. Bu, dosya meta verilerini
                    Discord'da kaydeder.
                  </p>
                  <h3 className="font-medium text-lg">İstek</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    <code>Content-Type: application/json</code>
                  </p>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-x-auto">
                    <code>
                      {`{
  "originalFileName": "string",
  "originalFileType": "string",
  "totalParts": "number",
  "fileHash": "string",
  "partMessages": [
    {
      "partIndex": "number",
      "messageId": "string",
      "attachmentUrl": "string"
    }
  ]
}`}
                    </code>
                  </pre>
                  <h3 className="font-medium text-lg">Yanıt</h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-x-auto">
                    <code>
                      {`{
  "message": "Çok parçalı yükleme başarıyla tamamlandı.",
  "finalMessageId": "string", // Dosya indirme için kullanılacak ana mesaj kimliği
  "fileName": "string",
  "fileType": "string",
  "totalParts": "number"
}`}
                    </code>
                  </pre>
                  <h3 className="font-medium text-lg">Hata Yanıtları</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    <li>
                      <code>400 Bad Request</code>: Eksik veya geçersiz veri, eksik/yanlış sırada parçalar.
                    </li>
                    <li>
                      <code>500 Internal Server Error</code>: Sunucu tarafında bir hata oluştu.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="download-multipart-file">
            <AccordionTrigger className="text-xl font-semibold">Çok Parçalı Dosya İndirme</AccordionTrigger>
            <AccordionContent>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                      GET
                    </Badge>
                    <code>/api/download/{`{messageId}`}</code>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Çok parçalı olarak yüklenmiş bir dosyayı Discord'dan indirir ve yeniden birleştirir.
                  </p>
                  <h3 className="font-medium text-lg">Parametreler</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    <li>
                      <code>messageId</code> (string): Dosyanın meta verilerini içeren Discord mesajının kimliği (
                      <code>/api/finalize-multipart-upload</code>'dan alınan <code>finalMessageId</code>).
                    </li>
                  </ul>
                  <h3 className="font-medium text-lg">Yanıt</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Dosyanın orijinal <code>Content-Type</code>'ı ile birleştirilmiş dosya.
                  </p>
                  <h3 className="font-medium text-lg">Hata Yanıtları</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    <li>
                      <code>400 Bad Request</code>: Mesaj kimliği eksik veya geçersiz dosya meta verileri.
                    </li>
                    <li>
                      <code>404 Not Found</code>: Meta veri mesajı bulunamadı.
                    </li>
                    <li>
                      <code>500 Internal Server Error</code>: Sunucu tarafında bir hata oluştu veya dosya parçaları
                      indirilemedi/birleştirilemedi.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  )
}
