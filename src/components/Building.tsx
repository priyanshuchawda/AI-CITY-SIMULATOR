import React, { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface BuildingProps {
  position: [number, number, number];
  height: number;
  type: string;
}

const Building: React.FC<BuildingProps> = ({ position, height, type }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, `/textures/${type}.jpg`);

  useEffect(() => {
    if (meshRef.current && meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      const isNight = false; // Replace with actual day/night logic
      if (isNight) {
        meshRef.current.material.emissive.setRGB(0.1, 0.1, 0.1);
      } else {
        meshRef.current.material.emissive.setRGB(0, 0, 0);
      }
    }
  }, []);

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[height, height, height]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default Building;