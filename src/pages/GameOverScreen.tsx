import styles from "./GameOverScreen.module.css";

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
    <div className={styles.container}>
      <img
        src="assets/images/barash.webp"
        alt="Game Over"
        className={styles.image}
      />
      <h1 className={styles.title}>Игра окончена!</h1>
      <div className={styles.scoreInfo}>
        <p>Игрок: {playerName}</p>
        <p>Счет: {score}</p>
      </div>
      <button onClick={onRestart} className={styles.restartButton}>
        Играть снова
      </button>
    </div>
  );
}
