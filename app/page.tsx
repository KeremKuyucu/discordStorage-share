import Link from "next/link"

export default function HomePage() {
  return (
    <>
      {/* Ambient background glow */}
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
          gap: "48px",
        }}
      >
        {/* Hero */}
        <div className="animate-fade-up" style={{ textAlign: "center", maxWidth: 560 }}>
          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <span className="discord-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Discord üzerinde çalışır
            </span>
          </div>

          {/* Logo mark */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "linear-gradient(135deg, #5865f2, #9b59f5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 60px rgba(88,101,242,0.4), 0 0 0 1px rgba(88,101,242,0.2)",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
          </div>

          <h1
            className="gradient-text"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}
          >
            DiscordStorage
          </h1>

          <p style={{ color: "#a1a1aa", fontSize: 17, lineHeight: 1.65, marginBottom: 32 }}>
            Discord altyapısını kullanan <strong style={{ color: "#e4e4e7" }}>ücretsiz ve sınırsız</strong> bulut
            depolama servisi. Dosyalarını güvenle yükle, arkadaşlarınla paylaş.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="https://github.com/KeremKuyucu/DiscordStorage/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Uygulamayı İndir
            </Link>
            <Link
              href="https://github.com/KeremKuyucu/DiscordStorage"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              GitHub&apos;da İncele →
            </Link>
          </div>
        </div>

        {/* Feature grid */}
        <div className="feature-grid animate-fade-up-delay-2" style={{ maxWidth: 720, width: "100%" }}>
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              ),
              title: "Sınırsız Depolama",
              desc: "Discord kanallarını kullanarak teorik olarak sınırsız dosya yükleyebilirsin.",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              ),
              title: "Kolay Paylaşım",
              desc: "Bir link ile dosyalarını başkalarıyla paylaş. Hesap gerekmez.",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ),
              title: "Güvenli",
              desc: "Kendi Discord sunucun üzerinde çalışır. Veriler 3. taraf sunucularda barındırılmaz.",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ),
              title: "Ücretsiz",
              desc: "Tamamen açık kaynaklı. Kendi sunucunu kurabilir veya uygulamamızı kullanabilirsin.",
            },
          ].map((f, i) => (
            <div key={i} className="feature-item animate-fade-up" style={{ animationDelay: `${0.15 * i + 0.3}s`, animationFillMode: "both" }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How to use */}
        <div className="animate-fade-up-delay-3" style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
          <p style={{ color: "#52525b", fontSize: 13 }}>
            Birinden bir paylaşım linki aldıysan, o link seni buraya yönlendirmiş olabilir.
            <br />
            ID&apos;yi kopyalayıp uygulamada ilgili alana yapıştır.
          </p>
        </div>

        {/* Footer */}
        <footer style={{ color: "#3f3f46", fontSize: 12, textAlign: "center" }}>
          DiscordStorage — Açık kaynak proje. Discord&apos;un resmi servisi değildir.
        </footer>
      </main>
    </>
  )
}
