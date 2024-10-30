import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { cityService } from '../services/cityService';
import { Entity, Scene } from 'aframe-react';

const CityView: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isVR, setIsVR] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // VR Button
    document.body.appendChild(VRButton.createButton(renderer));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // City generation
    const generateCity = () => {
      const cityData = cityService.getCityData();
      const buildingTypes = [
        { geometry: new THREE.BoxGeometry(1, 1, 1), material: new THREE.MeshPhongMaterial({ color: 0x808080 }) },
        { geometry: new THREE.CylinderGeometry(0.5, 0.5, 1, 32), material: new THREE.MeshPhongMaterial({ color: 0xa0a0a0 }) },
        { geometry: new THREE.ConeGeometry(0.5, 1, 32), material: new THREE.MeshPhongMaterial({ color: 0x909090 }) },
      ];

      const roadGeometry = new THREE.PlaneGeometry(100, 2);
      const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });

      for (let i = 0; i < cityData.population / 1000; i++) {
        const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
        const building = new THREE.Mesh(buildingType.geometry, buildingType.material);
        building.position.set(
          Math.random() * 100 - 50,
          Math.random() * 20,
          Math.random() * 100 - 50
        );
        building.scale.set(
          Math.random() * 5 + 1,
          Math.random() * 50 + 10,
          Math.random() * 5 + 1
        );
        scene.add(building);
      }

      // Add roads
      for (let i = -50; i <= 50; i += 10) {
        const horizontalRoad = new THREE.Mesh(roadGeometry, roadMaterial);
        horizontalRoad.position.set(0, 0.1, i);
        scene.add(horizontalRoad);

        const verticalRoad = new THREE.Mesh(roadGeometry, roadMaterial);
        verticalRoad.position.set(i, 0.1, 0);
        verticalRoad.rotation.y = Math.PI / 2;
        scene.add(verticalRoad);
      }
    };

    generateCity();

    // Camera position
    camera.position.set(0, 50, 100);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
      });
    };
    animate();

    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.setAnimationLoop(null);
    };
  }, []);

  // A-Frame AR component
  const ARView = () => (
    <Scene embedded arjs='sourceType: webcam; debugUIEnabled: false;'>
      <Entity
        geometry={{primitive: 'box'}}
        material={{color: 'red'}}
        position={{x: 0, y: 0.5, z: -3}}
        scale={{x: 0.5, y: 0.5, z: 0.5}}
      />
      <Entity camera />
    </Scene>
  );

  return (
    <>
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
      {isVR && <ARView />}
      <button onClick={() => setIsVR(!isVR)}>Toggle AR View</button>
    </>
  );
};

export default CityView;
