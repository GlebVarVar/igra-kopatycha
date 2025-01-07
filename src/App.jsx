import { PerspectiveCamera, Environment } from "@react-three/drei";
import { EffectComposer, HueSaturation } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Landscape } from "./LandscapeCopy";
import { SphereEnv } from "./SphereEnv";
import { Airplane } from "./Airplane";
import { Targets } from "./Targets";
import { MotionBlur } from "./MotionBlur";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState, useEffect } from "react";

// Функции для работы с таблицей лидеров
const getLeaderboard = () => {
  const leaderboard = localStorage.getItem('leaderboard');
  return leaderboard ? JSON.parse(leaderboard) : [];
};

const saveToLeaderboard = (name, score) => {
  const leaderboard = getLeaderboard();
  const existingPlayerIndex = leaderboard.findIndex(entry => entry.name === name);

  if (existingPlayerIndex !== -1) {
    // Если игрок уже есть в таблице
    if (leaderboard[existingPlayerIndex].score < score) {
      // Обновляем результат только если новый счет выше
      leaderboard[existingPlayerIndex] = {
        name,
        score,
        date: new Date().toLocaleDateString()
      };
    }
  } else {
    // Если игрока еще нет в таблице
    leaderboard.push({
      name,
      score,
      date: new Date().toLocaleDateString()
    });
  }

  // Сортируем по убыванию счета и берем топ-10
  leaderboard.sort((a, b) => b.score - a.score);
  const top10 = leaderboard.slice(0, 10);
  localStorage.setItem('leaderboard', JSON.stringify(top10));
};

function LeaderboardTable({ leaderboard }) {
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '20px',
      borderRadius: '15px',
      marginTop: '20px',
      marginBottom: "40px",
      maxWidth: '400px',
      width: '100%',
    }}>
      <h2 style={{ 
        color: '#ffd700', 
        textAlign: 'center',
        marginBottom: '15px'
      }}>
        Таблица лидеров
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 80px 100px',
        gap: '10px',
        color: '#fff',
        fontSize: '16px'
      }}>
        <div style={{ fontWeight: 'bold' }}>№</div>
        <div style={{ fontWeight: 'bold' }}>Имя</div>
        <div style={{ fontWeight: 'bold' }}>Очки</div>
        <div style={{ fontWeight: 'bold' }}>Дата</div>
        {leaderboard.map((entry, index) => (
          <React.Fragment key={index}>
            <div>{index + 1}</div>
            <div>{entry.name}</div>
            <div>{entry.score}</div>
            <div>{entry.date}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function StartScreen({ onStart }) {
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  const [error, setError] = useState('');

  const handleStart = () => {
    if (playerName.trim().length < 2) {
      setError('Имя должно содержать минимум 2 символа');
      return;
    }
    onStart(playerName);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      overflow: 'auto',
      padding: '20px 0'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100%',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        boxSizing: 'border-box',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          marginBottom: '20px',
          color: '#ffd700',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
        }}>
          Игра Капатыча
        </h1>
        <div style={{
          fontSize: '20px',
          marginBottom: '40px',
          textAlign: 'center',
          maxWidth: '600px',
          lineHeight: '1.6',
          color: '#ffffff'
        }}>
          <p>Управление: WASD для движения</p>
          <p>SHIFT для ускорения</p>
          <p>O - винтажный самолет, P - корсар</p>
          <p>Клавиши 1,2,3 для смены освещения</p>
          <p>Собирайте кольца для получения очков</p>
          <p>Капибара внутри кольца = 5 очков!</p>
          <p>У вас есть 2 минуты. Удачи!</p>
        </div>
        <div style={{
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError('');
            }}
            placeholder="Введите ваше имя"
            style={{
              padding: '10px 15px',
              fontSize: '18px',
              borderRadius: '8px',
              border: '2px solid #ffd700',
              background: 'rgba(0, 0, 0, 0.3)',
              color: '#fff',
              outline: 'none',
              width: '250px'
            }}
          />
          {error && <div style={{ color: '#ff6b6b', fontSize: '14px' }}>{error}</div>}
        </div>
        <button 
          onClick={handleStart}
          style={{
            padding: '15px 40px',
            fontSize: '24px',
            background: 'linear-gradient(45deg, #ffd700 0%, #ffa500 100%)',
            border: 'none',
            borderRadius: '25px',
            color: '#1a1a2e',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            outline: 'none',
            marginBottom: '30px'
          }}
          onMouseEnter={e => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
          }}
        >
          НАЧАТЬ ИГРУ
        </button>
        <LeaderboardTable leaderboard={leaderboard} />
      </div>
    </div>
  );
}

function GameOverScreen({ score, playerName, onRestart }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      zIndex: 9999
    }}>
      <img 
        src="assets/barash.webp" 
        alt="Бараш"
        style={{
          width: '400px',
          objectFit: 'contain',
          marginBottom: '20px'
        }}
      />
      <h1 style={{ 
        fontSize: '48px',
        color: '#ffd700',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Игра окончена!
      </h1>
      <div style={{
        fontSize: '24px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <p>Игрок: {playerName}</p>
        <p>Очки: {score}</p>
      </div>
      <button
        onClick={onRestart}
        style={{
          padding: '15px 40px',
          fontSize: '24px',
          background: 'linear-gradient(45deg, #ffd700 0%, #ffa500 100%)',
          border: 'none',
          borderRadius: '25px',
          color: '#1a1a2e',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={e => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
        }}
        onMouseLeave={e => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
        }}
      >
        Играть снова
      </button>
    </div>
  );
}

function DeathPlane() {
  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial 
        color="#ff0000"
        transparent={true}
        opacity={0.5}
      />
    </mesh>
  );
}

function AppWrapper() {
  const [counter, setCounter] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    let timer;
    if (isGameStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isGameStarted) {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [isGameStarted, timeLeft]);

  const handleGameStart = (name) => {
    setPlayerName(name);
    setIsGameStarted(true);
    setTimeLeft(60);
    setIsGameOver(false);
    setCounter(0);
  };

  const handleGameOver = () => {
    saveToLeaderboard(playerName, counter);
    setIsGameStarted(false);
    setIsGameOver(true);
  };

  const handleRestart = () => {
    setIsGameOver(false);
  };

  if (isGameOver) {
    return <GameOverScreen 
      score={counter} 
      playerName={playerName} 
      onRestart={handleRestart}
    />;
  }

  if (!isGameStarted) {
    return <StartScreen onStart={handleGameStart} />;
  }

  return (
    <>
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        padding: "15px 25px",
        background: "rgba(0, 0, 0, 0.7)",
        borderRadius: "15px",
        color: "#fff",
        fontSize: "24px",
        fontFamily: "Arial, sans-serif",
        fontWeight: "bold",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 9999,
        backdropFilter: "blur(5px)",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <span style={{ color: "#ffd700" }}>{playerName}:</span>
        <span>{counter}</span>
      </div>
      <div style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "15px 25px",
        background: timeLeft <= 30 ? "rgba(255, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.7)",
        borderRadius: "15px",
        color: "#fff",
        fontSize: "24px",
        fontFamily: "Arial, sans-serif",
        fontWeight: "bold",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 9999,
        backdropFilter: "blur(5px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "background 0.3s"
      }}>
        <span style={{ color: "#ffd700" }}>Время:</span>
        <span>{timeLeft}</span>
      </div>
      <button
        onClick={handleGameOver}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          background: "rgba(255, 0, 0, 0.7)",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          cursor: "pointer",
          zIndex: 9999,
          fontSize: "16px"
        }}
      >
        Завершить игру
      </button>
      <Canvas shadows>
        <Suspense fallback={null}>
          <App setCounter={setCounter} counter={counter}/>
        </Suspense>
      </Canvas>
    </>
  );
}

function App({setCounter, counter}) {
  const [lightMode, setLightMode] = useState('day');
  const [planeType, setPlaneType] = useState('vintage');

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key.toLowerCase()) {
        case '1':
          setLightMode('day');
          break;
        case '2':
          setLightMode('night');
          break;
        case '3':
          setLightMode('sunset');
          break;
        case 'o':
          setPlaneType('vintage');
          break;
        case 'p':
          setPlaneType('corsair');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getLightConfig = () => {
    switch(lightMode) {
      case 'day':
        return {
          color: "#f3d29a",
          intensity: 2,
          position: [10, 5, 4]
        };
      case 'night':
        return {
          color: "#4444ff",
          intensity: 0.5,
          position: [-5, 8, -10],
          fog: true
        };
      case 'sunset':
        return {
          color: "#ff8c69",
          intensity: 1.2,
          position: [-2, 3, 5]
        };
      default:
        return {
          color: "#f3d29a",
          intensity: 2,
          position: [10, 5, 4]
        };
    }
  };

  const lightConfig = getLightConfig();

  return (
    <>
      <SphereEnv />
      <Environment background={false} files={"assets/textures/envmap.hdr"} />

      <PerspectiveCamera makeDefault position={[0, 10, 10]} />

      {/* <Landscapeц /> */}
      <Airplane planeType={planeType} />
      <DeathPlane />
      <Targets setCounter={setCounter} counter={counter}/>

      <directionalLight
        castShadow
        color={lightConfig.color}
        intensity={lightConfig.intensity}
        position={lightConfig.position}
        shadow-bias={-0.0005}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.01}
        shadow-camera-far={20}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-left={-6.2}
        shadow-camera-right={6.4}
      />

      {lightMode === 'night' && (
        <>
          <ambientLight intensity={0.1} color="#4444ff" />
          <pointLight
            position={[0, 10, 0]}
            intensity={0.3}
            color="#ffffff"
            distance={20}
          />
          <fog attach="fog" color="#000033" near={1} far={30} />
        </>
      )}

      <EffectComposer>
        <MotionBlur />
        <HueSaturation
          blendFunction={BlendFunction.NORMAL}
          hue={lightMode === 'night' ? 0.2 : -0.15}
          saturation={lightMode === 'night' ? -0.2 : 0.1}
        />
      </EffectComposer>
    </>
  );
}

export default AppWrapper;
