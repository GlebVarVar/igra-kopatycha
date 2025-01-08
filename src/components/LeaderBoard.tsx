import styles from "./LeaderBoard.module.css";

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
    <div className={styles.leaderboardContainer}>
      <h2 className={styles.leaderboardTitle}>Таблица лидеров</h2>
      <table className={styles.leaderboardTable}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Место</th>
            <th className={styles.tableHeader}>Имя</th>
            <th className={styles.tableHeader}>Очки</th>
            <th className={styles.tableHeader}>Дата</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.tableCell}>{index + 1}</td>
              <td className={styles.tableCell}>{entry.name}</td>
              <td className={styles.tableCell}>{entry.score}</td>
              <td className={styles.tableCell}>{entry.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
