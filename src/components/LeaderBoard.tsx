import { Fragment } from "react/jsx-runtime";

export type LeaderboardTableProps = {
  leaderboard: PlayerData[];
};

export type PlayerData = {
  name: string;
  score: number;
  date: string;
};

// Функции для работы с таблицей лидеров
export const getLeaderboard = (): PlayerData[] => {
  const leaderboard = localStorage.getItem("leaderboard");
  return leaderboard ? JSON.parse(leaderboard) : [];
};

export const saveToLeaderboard = (name: string, score: number) => {
  const leaderboard = getLeaderboard();
  const existingPlayerIndex = leaderboard.findIndex(
    (entry) => entry.name === name,
  );

  if (existingPlayerIndex !== -1) {
    // Если игрок уже есть в таблице
    if (leaderboard[existingPlayerIndex].score < score) {
      // Обновляем результат только если новый счет выше
      leaderboard[existingPlayerIndex] = {
        name,
        score,
        date: new Date().toLocaleDateString(),
      };
    }
  } else {
    // Если игрока еще нет в таблице
    leaderboard.push({
      name,
      score,
      date: new Date().toLocaleDateString(),
    });
  }

  // Сортируем по убыванию счета и берем топ-10
  leaderboard.sort((a, b) => b.score - a.score);
  const top10 = leaderboard.slice(0, 10);
  localStorage.setItem("leaderboard", JSON.stringify(top10));
};

export function LeaderboardTable({ leaderboard }: LeaderboardTableProps) {
  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        padding: "20px",
        borderRadius: "15px",
        marginTop: "20px",
        marginBottom: "40px",
        maxWidth: "400px",
        width: "100%",
      }}
    >
      <h2
        style={{
          color: "#ffd700",
          textAlign: "center",
          marginBottom: "15px",
        }}
      >
        Таблица лидеров
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 80px 100px",
          gap: "10px",
          color: "#fff",
          fontSize: "16px",
        }}
      >
        <div style={{ fontWeight: "bold" }}>№</div>
        <div style={{ fontWeight: "bold" }}>Имя</div>
        <div style={{ fontWeight: "bold" }}>Очки</div>
        <div style={{ fontWeight: "bold" }}>Дата</div>
        {leaderboard.map((entry, index) => (
          <Fragment key={index}>
            <div>{index + 1}</div>
            <div>{entry.name}</div>
            <div>{entry.score}</div>
            <div>{entry.date}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
