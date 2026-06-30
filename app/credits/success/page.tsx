export default function CreditsSuccessPage() {
  return (
    <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Payment successful!
      </h1>
      <p style={{ color: "#888" }}>
        Your credits have been added to your account.
      </p>
      
       <a href="/"
        style={{
          display: "inline-block",
          marginTop: 24,
          padding: "10px 24px",
          background: "#fff",
          color: "#000",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Start chatting
      </a>
    </div>
  );
}
