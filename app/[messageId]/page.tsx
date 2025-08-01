"use client" // Bu bileşenin istemci tarafında çalışmasını sağlar

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Copy } from "lucide-react"

export default function Component() {
  const params = useParams()
  const messageId = params.messageid as string | undefined
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (messageId) {
      navigator.clipboard.writeText(messageId).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // 2 saniye sonra kopyalandı durumunu sıfırla
      })
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Uygulamanızı Başlatın</CardTitle>
          <CardDescription>
            {messageId
              ? "Bu ID ile uygulamanızı nasıl açacağınızı öğrenin."
              : "Geçersiz bir ID ile geldiniz. Lütfen doğru bir ID ile gelin (örn: /123)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {messageId ? (
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-700 dark:text-gray-300">
                Uygulamayı kullanmaya başlamak için aşağıdaki adımları izleyin:
              </p>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">1. Uygulamayı İndirin veya Açın</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Eğer uygulamanız yüklü değilse, en son sürümünü GitHub'dan indirin. Yüklüyse, uygulamayı başlatın.
                  </p>
                  <Button asChild className="w-full">
                    <Link
                      href="https://github.com/KeremKuyucu/DiscordStorage/releases/latest"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Uygulamayı GitHub'dan İndir
                    </Link>
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">2. Bu ID'yi Kopyalayın</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aşağıdaki ID'yi kopyalayın. Uygulama içinde bu ID'yi yapıştırmanız gerekecek.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Input id="message-id" type="text" value={messageId} readOnly className="flex-1" />
                    <Button onClick={handleCopy} size="icon" className="shrink-0">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span className="sr-only">{copied ? "Kopyalandı" : "Kopyala"}</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">3. Uygulamaya ID'yi Girin</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Uygulamayı açtıktan sonra, ilgili alana kopyaladığınız ID'yi yapıştırın ve işlemi tamamlayın.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>Bu sayfa, bir Flutter uygulamasını belirli bir ID ile kullanmak için talimatlar sağlar.</p>
              <p>
                Örnek kullanım: <code className="bg-gray-200 p-1 rounded">/12345</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
