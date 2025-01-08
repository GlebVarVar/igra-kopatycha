import { useState } from "react";
import { getLeaderboard, LeaderboardTable } from "../components/LeaderBoard";
import styles from "./StartScreen.module.css";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
    setError("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Игра Капатыча</h1>
        <div className={styles.instructions}>
          <p>Управление: WASD для движения</p>
          <p>SHIFT для ускорения</p>
          <p>O - винтажный самолет, P - корсар</p>
          <p>Клавиши 1,2,3 для смены освещения</p>
          <p>Собирайте кольца для получения очков</p>
          <p>Капибара внутри кольца = 5 очков!</p>
          <p>У вас есть 2 минуты. Удачи!</p>
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={playerName}
            onChange={handleInputChange}
            placeholder="Введите ваше имя"
            className={styles.input}
          />
          {error && <div className={styles.error}>{error}</div>}
        </div>
        <button onClick={handleStart} className={styles.startButton}>
          НАЧАТЬ ИГРУ
        </button>
        <LeaderboardTable leaderboard={leaderboard} />
      </div>
    </div>
  );
}
