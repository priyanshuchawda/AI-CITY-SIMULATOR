import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CloudProps {
  position: [number, number, number];
  speed: number;
  opacity: number;
}

const Cloud: React.FC<CloudProps> = ({ position, speed, opacity }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x += speed;
      if (meshRef.current.position.x > 50) {
        meshRef.current.position.x = -50;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="white" transparent opacity={opacity} />
    </mesh>
  );
};

export default Cloud;