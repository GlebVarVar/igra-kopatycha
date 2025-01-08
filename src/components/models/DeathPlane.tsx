export function DeathPlane() {
  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#ff0000" transparent={true} opacity={0.5} />
    </mesh>
  );
}
