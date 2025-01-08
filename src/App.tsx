import { PerspectiveCamera, Environment } from "@react-three/drei";
import { EffectComposer, HueSaturation } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Landscape } from "./components/models/LandscapeCopy";
import { SphereEnv } from "./components/models/SphereEnv";
import { Targets } from "./components/models/Targets";
import { MotionBlur } from "./MotionBlur";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState, useEffect } from "react";
import { Airplane, DeathPlane } from "./components/models";

function AppWrapper() {
  const [counter, setCounter] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    let timer;
    if (isGameStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isGameStarted) {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [isGameStarted, timeLeft]);

  const handleGameStart = (name: string) => {
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
    return (
      <GameOverScreen
        score={counter}
        playerName={playerName}
        onRestart={handleRestart}
      />
    );
  }

  if (!isGameStarted) {
    return <StartScreen onStart={handleGameStart} />;
  }

  return (
    <>
      <div
        style={{
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
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <span style={{ color: "#ffd700" }}>{playerName}:</span>
        <span>{counter}</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "15px 25px",
          background:
            timeLeft <= 30 ? "rgba(255, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.7)",
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
          transition: "background 0.3s",
        }}
      >
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
          fontSize: "16px",
        }}
      >
        Завершить игру
      </button>
      <Canvas shadows>
        <Suspense fallback={null}>
          <App setCounter={setCounter} counter={counter} />
        </Suspense>
      </Canvas>
    </>
  );
}

export type AppProps = {
  setCounter: (value: number) => void;
  counter: number;
};

function App({ setCounter, counter }: AppProps) {
  const [lightMode, setLightMode] = useState("day");
  const [planeType, setPlaneType] = useState("vintage");

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "1":
          setLightMode("day");
          break;
        case "2":
          setLightMode("night");
          break;
        case "3":
          setLightMode("sunset");
          break;
        case "o":
          setPlaneType("vintage");
          break;
        case "p":
          setPlaneType("corsair");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const getLightConfig = () => {
    switch (lightMode) {
      case "day":
        return {
          color: "#f3d29a",
          intensity: 2,
          position: [10, 5, 4],
        };
      case "night":
        return {
          color: "#4444ff",
          intensity: 0.5,
          position: [-5, 8, -10],
          fog: true,
        };
      case "sunset":
        return {
          color: "#ff8c69",
          intensity: 1.2,
          position: [-2, 3, 5],
        };
      default:
        return {
          color: "#f3d29a",
          intensity: 2,
          position: [10, 5, 4],
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
      <Targets setCounter={setCounter} counter={counter} />

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

      {lightMode === "night" && (
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
          hue={lightMode === "night" ? 0.2 : -0.15}
          saturation={lightMode === "night" ? -0.2 : 0.1}
        />
      </EffectComposer>
    </>
  );
}

export default AppWrapper;
