import { useState } from "react";
import { getLeaderboard, LeaderboardTable } from "../components/LeaderBoard";

export type StartScreenProps = {
  onStart: (playerName: string) => void;
};

export function StartScreen({ onStart }: StartScreenProps) {
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  const [error, setError] = useState("");

  const handleStart = () => {
    if (playerName.trim().length < 2) {
      setError("Имя должно содержать минимум 2 символа");
      return;
    }
    onStart(playerName);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        overflow: "auto",
        padding: "20px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100%",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
          boxSizing: "border-box",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "20px",
            color: "#ffd700",
            textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
          }}
        >
          Игра Капатыча
        </h1>
        <div
          style={{
            fontSize: "20px",
            marginBottom: "40px",
            textAlign: "center",
            maxWidth: "600px",
            lineHeight: "1.6",
            color: "#ffffff",
          }}
        >
          <p>Управление: WASD для движения</p>
          <p>SHIFT для ускорения</p>
          <p>O - винтажный самолет, P - корсар</p>
          <p>Клавиши 1,2,3 для смены освещения</p>
          <p>Собирайте кольца для получения очков</p>
          <p>Капибара внутри кольца = 5 очков!</p>
          <p>У вас есть 2 минуты. Удачи!</p>
        </div>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError("");
            }}
            placeholder="Введите ваше имя"
            style={{
              padding: "10px 15px",
              fontSize: "18px",
              borderRadius: "8px",
              border: "2px solid #ffd700",
              background: "rgba(0, 0, 0, 0.3)",
              color: "#fff",
              outline: "none",
              width: "250px",
            }}
          />
          {error && (
            <div style={{ color: "#ff6b6b", fontSize: "14px" }}>{error}</div>
          )}
        </div>
        <button
          onClick={handleStart}
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
            outline: "none",
            marginBottom: "30px",
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
          НАЧАТЬ ИГРУ
        </button>
        <LeaderboardTable leaderboard={leaderboard} />
      </div>
    </div>
  );
}
