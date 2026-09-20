"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy, Download, ExternalLink, Play, Rocket } from "lucide-react"

interface SharePageClientProps {
  messageId: string
}

export default function SharePageClient({ messageId }: SharePageClientProps) {
  const [copied, setCopied] = useState(false)
  const [launching, setLaunching] = useState(false)
  const [launched, setLaunched] = useState(false)

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea")
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleOpenApp = async () => {
    // 1. ID'yi hemen panoya kopyala (güvenlik ağı olarak)
    await handleCopyText(messageId)
    setLaunching(true)
    setLaunched(true)

    // 2. Özel şema ile DiscordStorage uygulamasını aç
    const protocolUrl = `discordstorage://${messageId}`
    window.location.href = protocolUrl

    // 3. Durum animasyonu
    setTimeout(() => {
      setLaunching(false)
    }, 1800)
  }

  return (
    <>
      <div className="ambient-bg" />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          className="glass-card animate-fade-up"
          style={{ width: "100%", maxWidth: 490, padding: "36px 32px" }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #5865f2, #9b59f5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 40px rgba(88,101,242,0.4)",
                }}
              >
                <Download size={26} color="white" strokeWidth={2.2} />
              </div>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
                fontWeight: 800,
                color: "#f1f1f3",
                marginBottom: 8,
                lineHeight: 1.2,
              }}
            >
              Dosya Paylaşımı
            </h1>
            <p style={{ color: "#71717a", fontSize: 14, lineHeight: 1.6 }}>
              Birisi seninle DiscordStorage üzerinden bir dosya paylaştı.
              <br />
              Tek tıkla uygulamada açıp indirmeyi başlatabilirsin.
            </p>
          </div>

          {/* Hero CTA Button: Open in App */}
          <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              type="button"
              onClick={handleOpenApp}
              className={`btn-open-app ${launching ? "launching" : ""}`}
              id="open-in-app-btn"
            >
              {launching ? (
                <>
                  <Check size={20} className="animate-check-pop" />
                  <span>Uygulama Başlatılıyor...</span>
                </>
              ) : (
                <>
                  <Rocket size={20} />
                  <span>DiscordStorage&apos;da Aç</span>
                </>
              )}
            </button>

            {launched && (
              <div className="launch-feedback animate-fade-in">
                <Check size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Uygulama açılıyor!</strong> Dosya ID&apos;si panonuza kopyalandı.
                  Uygulama açıldığında indirme otomatik başlar veya yapıştırabilirsiniz.
                </div>
              </div>
            )}
          </div>

          <div className="divider" />

          {/* Step by step guide */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Step 1 */}
            <div className="step-card animate-fade-up-delay-1">
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span className="step-number">1</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#e4e4e7", marginBottom: 4 }}>
                    Uygulamayı Aç veya İndir
                  </h3>
                  <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.6, marginBottom: 12 }}>
                    DiscordStorage yüklüyse yukarıdaki butona tıklayarak doğrudan açın. Yüklü değilse GitHub&apos;dan indirin.
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={handleOpenApp}
                      className="btn-primary"
                      style={{ fontSize: 13, padding: "8px 16px" }}
                    >
                      <Play size={14} />
                      Uygulamayı Aç
                    </button>
                    <Link
                      href="https://github.com/KeremKuyucu/DiscordStorage/releases/latest"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                      style={{ fontSize: 13, padding: "8px 16px" }}
                    >
                      <ExternalLink size={14} />
                      GitHub&apos;dan İndir
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="step-card animate-fade-up-delay-2">
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span className="step-number">2</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#e4e4e7", marginBottom: 4 }}>
                    Dosya ID&apos;si
                  </h3>
                  <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.6, marginBottom: 10 }}>
                    ID&apos;yi kopyalamak için kutuya veya kopyala butonuna tıklayabilirsiniz.
                  </p>

                  {/* ID display */}
                  <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                    <div
                      className="id-box"
                      style={{ flex: 1, display: "flex", alignItems: "center", cursor: "pointer" }}
                      onClick={() => handleCopyText(messageId)}
                      title="ID'yi kopyalamak için tıklayın"
                    >
                      {messageId}
                    </div>
                    <button
                      onClick={() => handleCopyText(messageId)}
                      className={`btn-copy ${copied ? "copied" : ""}`}
                      title={copied ? "Kopyalandı!" : "Kopyala"}
                    >
                      {copied ? (
                        <Check size={18} className="animate-check-pop" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>

                  {copied && (
                    <p
                      className="animate-fade-in"
                      style={{
                        fontSize: 12,
                        color: "#4ade80",
                        marginTop: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Check size={12} /> Panoya kopyalandı!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="step-card animate-fade-up-delay-3">
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span className="step-number">3</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#e4e4e7", marginBottom: 4 }}>
                    Uygulamadan İndirin
                  </h3>
                  <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.6 }}>
                    Uygulama açıldığında sağ üst köşedeki{" "}
                    <span
                      style={{
                        background: "rgba(88,101,242,0.2)",
                        color: "#818cf8",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: 12,
                        fontFamily: "var(--font-mono, monospace)",
                      }}
                    >
                      ↓ İndir
                    </span>{" "}
                    butonuna basıp ID&apos;yi yapıştırarak indirmeyi tamamlayın.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="divider" />
          <div style={{ textAlign: "center" }}>
            <Link
              href="/"
              style={{ fontSize: 12, color: "#52525b", textDecoration: "none" }}
            >
              DiscordStorage hakkında daha fazla bilgi →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
