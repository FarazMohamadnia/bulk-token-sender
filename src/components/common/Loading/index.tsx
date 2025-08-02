const Loading = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: "#000000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#ffffff",
        fontSize: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid #ffffff",
              borderTop: "3px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
        </div>
        <div>Loading...</div>
      </div>
      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
