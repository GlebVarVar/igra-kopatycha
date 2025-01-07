import { useState, useMemo } from "react";
import { Quaternion, TorusGeometry, Vector3 } from "three";
import { mergeBufferGeometries } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { planePosition } from "./Airplane";

function randomPoint(scale) {
  return new Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ).multiply(scale || new Vector3(1, 1, 1));
}

const TARGET_RAD = 0.125;
const CAPYBARA_COUNT = 5;

export function Targets({setCounter, counter}) {
  const { scene: capybaraScene } = useGLTF("assets/models/capybara.gltf");
  const [targets, setTargets] = useState(() => {
    const arr = [];
    for (let i = 0; i < 25; i++) {
      arr.push({
        center: randomPoint(new Vector3(4, 1, 4)).add(
          new Vector3(0, 2 + Math.random() * 2, 0)
        ),
        direction: randomPoint().normalize(),
        hit: false,
        hasCapybara: i < CAPYBARA_COUNT
      });
    }
    return arr;
  });

  const geometry = useMemo(() => {
    let geo;

    targets.forEach((target) => {
      const torusGeo = new TorusGeometry(TARGET_RAD, 0.02, 8, 25);
      torusGeo.applyQuaternion(
        new Quaternion().setFromUnitVectors(
          new Vector3(0, 0, 1),
          target.direction
        )
      );
      torusGeo.translate(target.center.x, target.center.y, target.center.z);

      if (!geo) geo = torusGeo;
      else geo = mergeBufferGeometries([geo, torusGeo]);
    });

    return geo;
  }, [targets]);

  useFrame(() => {
    targets.forEach((target) => {
      const v = planePosition.clone().sub(target.center);
      const dist = target.direction.dot(v);
      const projected = planePosition
        .clone()
        .sub(target.direction.clone().multiplyScalar(dist));

      const hitDist = projected.distanceTo(target.center);
      if (hitDist < TARGET_RAD) {
        target.hit = true;
      }
    });

    const atLeastOneHit = targets.find((target) => target.hit);
    if (atLeastOneHit) {
      setTargets(targets.filter((target) => {
        if (target.hit) {
          setCounter(counter + (target.hasCapybara ? 5 : 1));
        }
        return !target.hit}));
    }
  });

  return (
    <>
      <mesh geometry={geometry}>
        <meshStandardMaterial roughness={0.5} metalness={0.5} />
      </mesh>
      {targets.map((target, i) => 
        target.hasCapybara && (
          <primitive 
            key={i}
            object={capybaraScene.clone()} 
            position={target.center}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
            scale={0.01}
          />
        )
      )}
    </>
  );
}

useGLTF.preload("assets/models/capybara.gltf");
