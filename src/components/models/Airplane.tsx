/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.7 public/assets/models/airplane.glb
*/

import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  Matrix4,
  Quaternion,
  Vector3,
  Audio,
  AudioListener,
  AudioLoader,
} from "three";
import { updatePlaneAxis } from "../../controls";

const x = new Vector3(1, 0, 0);
const y = new Vector3(0, 1, 0);
const z = new Vector3(0, 0, 1);
export const planePosition = new Vector3(0, 3, 7);

const delayedRotMatrix = new Matrix4();
const delayedQuaternion = new Quaternion();

export function Airplane(props) {
  // https://sketchfab.com/3d-models/vintage-toy-airplane-7de2ecbc0acb4b1886c3df3d196c366b
  const { nodes, materials } = useGLTF("assets/models/airplane.glb");
  const corsair = useGLTF("assets/models/corsair.glb");
  // https://sketchfab.com/3d-models/3253b9c057ca4bab94d963e5ebcaaa94
  const capatich = useGLTF("assets/models/kapatich.glb");
  const groupRef = useRef();
  const helixMeshRef = useRef();
  const soundRef = useRef();
  const listenerRef = useRef();
  const filterRef = useRef();

  useEffect(() => {
    // Создаем слушателя звука
    const listener = new AudioListener();
    listenerRef.current = listener;

    // Создаем источник звука
    const sound = new Audio(listener);
    soundRef.current = sound;

    const audioContext = listener.context;
    const bassBoostFilter = audioContext.createBiquadFilter();
    bassBoostFilter.type = "lowshelf";
    bassBoostFilter.frequency.value = 80; // Boost frequencies below 200 Hz
    bassBoostFilter.gain.value = 0; // Start with no boost
    filterRef.current = bassBoostFilter;
    console.log(filterRef.current);

    // Connect the sound to the filter, and then to the listener
    sound.setFilter(bassBoostFilter);

    // Загружаем звуковой файл
    const audioLoader = new AudioLoader();
    audioLoader.load("assets/sound/otvinta.mp3", (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(1);
      sound.play();
    });

    return () => {
      // Очищаем ресурсы при размонтировании
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.disconnect();
      }
    };
  }, []);

  useFrame(({ camera }) => {
    // Обновляем позицию слушателя звука
    if (listenerRef.current) {
      camera.add(listenerRef.current);
    }

    // Обновляем громкость в зависимости от ускорения
    if (soundRef.current && filterRef.current) {
      const isAccelerating = window.isShiftPressed; // Проверяем нажат ли Shift
      soundRef.current.setVolume(isAccelerating ? 2.0 : 0.5);
      filterRef.current.gain.value = isAccelerating ? 50 : 0;
    }

    updatePlaneAxis(x, y, z, planePosition, camera);

    const rotMatrix = new Matrix4().makeBasis(x, y, z);

    const matrix = new Matrix4()
      .multiply(
        new Matrix4().makeTranslation(
          planePosition.x,
          planePosition.y,
          planePosition.z,
        ),
      )
      .multiply(rotMatrix);

    groupRef.current.matrixAutoUpdate = false;
    groupRef.current.matrix.copy(matrix);
    groupRef.current.matrixWorldNeedsUpdate = true;

    var quaternionA = new Quaternion().copy(delayedQuaternion);

    // warning! setting the quaternion from the rotation matrix will cause
    // issues that resemble gimbal locks, instead, always use the quaternion notation
    // throughout the slerping phase
    // quaternionA.setFromRotationMatrix(delayedRotMatrix);

    var quaternionB = new Quaternion();
    quaternionB.setFromRotationMatrix(rotMatrix);

    var interpolationFactor = 0.175;
    var interpolatedQuaternion = new Quaternion().copy(quaternionA);
    interpolatedQuaternion.slerp(quaternionB, interpolationFactor);
    delayedQuaternion.copy(interpolatedQuaternion);

    delayedRotMatrix.identity();
    delayedRotMatrix.makeRotationFromQuaternion(delayedQuaternion);

    const cameraMatrix = new Matrix4()
      .multiply(
        new Matrix4().makeTranslation(
          planePosition.x,
          planePosition.y,
          planePosition.z,
        ),
      )
      .multiply(delayedRotMatrix)
      .multiply(new Matrix4().makeRotationX(-0.2))
      .multiply(new Matrix4().makeTranslation(0, 0.015, 0.3));

    camera.matrixAutoUpdate = false;
    camera.matrix.copy(cameraMatrix);
    camera.matrixWorldNeedsUpdate = true;

    if (props.planeType === "vintage") {
      helixMeshRef.current.rotation.z -= 1.0;
    }

    // Проверка столкновения с нижней плоскостью
    if (planePosition.y < -10) {
      // Остановка звука
      if (soundRef.current) {
        soundRef.current.stop();
      }

      // Вызываем функцию завершения игры
      props.onGameOver();
    }
  });

  console.log(capatich.scene);

  return (
    <>
      <group ref={groupRef}>
        {props.planeType === "vintage" ? (
          <group {...props} dispose={null} scale={0.01} rotation-y={Math.PI}>
            <primitive object={capatich.scene} scale={10} position-y={1} />
            <mesh
              geometry={nodes.supports.geometry}
              material={materials["Material.004"]}
            />
            <mesh
              geometry={nodes.chassis.geometry}
              material={materials["Material.005"]}
            />
            <mesh
              geometry={nodes.helix.geometry}
              material={materials["Material.005"]}
              ref={helixMeshRef}
            />
          </group>
        ) : (
          <group
            {...props}
            dispose={null}
            scale={0.01}
            rotation-y={Math.PI}
            rotation-x={Math.PI}
            rotation-z={(Math.PI * 2) / 4 + Math.PI}
          >
            <mesh
              geometry={corsair.nodes.Cube001_Black_0.geometry}
              material={corsair.materials["Black"]}
            />
            <mesh
              geometry={corsair.nodes.Cube001_Chassis_0.geometry}
              material={corsair.materials["Chassis"]}
            />
            <mesh
              geometry={corsair.nodes.Cube001_Glass_0.geometry}
              material={corsair.materials["Glass"]}
              ref={helixMeshRef}
            />
          </group>
        )}
      </group>
    </>
  );
}

useGLTF.preload("assets/models/airplane.glb");
useGLTF.preload("assets/models/corsair.glb");