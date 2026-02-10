import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const Box = () => {
  const meshRef = React.useRef<Mesh>(null!);

  // Rotate the box every frame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box />
    </Canvas>
  );
};

export default App;
