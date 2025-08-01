"use client" // Bu bileşenin istemci tarafında çalışmasını sağlar

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Uygulamanızı Kullanmaya Başlayın</CardTitle>
          <CardDescription>DiscordStorage uygulamasını nasıl kullanacağınızı öğrenin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                <h3 className="font-semibold text-lg">2. ID'nizi Bulun ve Kopyalayın</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uygulama içinde kullanmanız gereken ID'yi (örneğin bir mesaj ID'si) ilgili kaynaktan (örneğin bir
                  Discord mesajı veya başka bir web sayfası) bulun ve kopyalayın.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">3. Uygulamaya ID'yi Girin</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uygulamayı açtıktan sonra, sağ üst köşedeki indirme tuşuna basın ve açılan alana kopyaladığınız ID'yi
                  yapıştırın.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
