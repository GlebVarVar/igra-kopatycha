import { useState } from "react";
import { useMemo } from "react";
import { Quaternion } from "three";
import { TorusGeometry } from "three";
import { Vector3 } from "three";
import { mergeBufferGeometries } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { planePosition } from "./Airplane";

function randomPoint(scale) {
  return new Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ).multiplyScalar(scale || 1);
}

const TARGET_RAD = 0.125;

export function Targets() {
  const [targets, setTargets] = useState(() => {
    const arr = [];
    for (let i = 0; i < 15; i++) {
      arr.push({
        center: randomPoint().add(new Vector3(0, 1 + Math.random() * 2, 0)),
        direction: randomPoint().normalize(),
        hit: false,
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
    targets.forEach((target, i) => {
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
      setTargets(targets.filter(target => !target.hit));      
    }
  });

  return (
    <mesh geometry={geometry}>
      {/* <meshBasicMaterial color={"red"} /> */}
      <meshStandardMaterial roughness={0.5} metalness={0.5} />
    </mesh>
  );
}