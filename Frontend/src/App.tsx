import React, { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import TextBoxButton from "./Components/TextBox&Button";
const API_URL = import.meta.env.VITE_API_URL;

type WordType = {
    word: string;
    weight: number; 
}

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

// this function fetches the json list of words and their associated weights
export async function fetchWordCloud(url: string): Promise<WordType[]> {
  try {
    console.log("Function Reached!")
    const response = await fetch(`${API_URL}/analyze`, { // replace with your backend URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("ResponseFetched")
    const data: WordType[] = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error("Error fetching word cloud:", error);
    return [];
  }
}


const App = () => {
  return (
    <>
      <TextBoxButton />
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box />
        
      </Canvas>
    </>
  );
};

export default App;
