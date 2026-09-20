export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        gap: "20px",
        background: "#0e0e10",
      }}
    >
      {/* Discord-themed logo mark */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "16px",
            background: "linear-gradient(135deg, #5865f2, #9b59f5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px rgba(88,101,242,0.5)",
          }}
        >
          {/* Storage icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        {/* Spinner ring around logo */}
        <div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: "50%",
            border: "2.5px solid transparent",
            borderTopColor: "#5865f2",
            borderRightColor: "rgba(88,101,242,0.3)",
            animation: "spin 0.9s linear infinite",
          }}
        />
      </div>

      <p style={{ color: "#6b6b76", fontSize: 14, letterSpacing: "0.03em" }}>
        Yükleniyor…
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
