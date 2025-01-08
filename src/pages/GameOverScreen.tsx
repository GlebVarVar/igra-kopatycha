export type GameOverScreenProps = {
  score: number;
  playerName: string;
  onRestart: () => void;
};

export function GameOverScreen({
  score,
  playerName,
  onRestart,
}: GameOverScreenProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        zIndex: 9999,
      }}
    >
      <img
        src="assets/barash.webp"
        alt="Бараш"
        style={{
          width: "400px",
          objectFit: "contain",
          marginBottom: "20px",
        }}
      />
      <h1
        style={{
          fontSize: "48px",
          color: "#ffd700",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Игра окончена!
      </h1>
      <div
        style={{
          fontSize: "24px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <p>Игрок: {playerName}</p>
        <p>Очки: {score}</p>
      </div>
      <button
        onClick={onRestart}
        style={{
          padding: "15px 40px",
          fontSize: "24px",
          background: "linear-gradient(45deg, #ffd700 0%, #ffa500 100%)",
          border: "none",
          borderRadius: "25px",
          color: "#1a1a2e",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
          e.target.style.boxShadow = "0 6px 20px rgba(255, 215, 0, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 15px rgba(255, 215, 0, 0.3)";
        }}
      >
        Играть снова
      </button>
    </div>
  );
}
