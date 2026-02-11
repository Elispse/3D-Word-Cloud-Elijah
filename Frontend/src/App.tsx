import React, { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import TextBoxButton from "./Components/TextBox&Button";
import WordCloud from './Components/WordCloud';
import "./App.css"

const API_URL = import.meta.env.VITE_API_URL;

export type WordType = {
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
    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: WordType[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching word cloud:", error);
    return [];
  }
}


const App = () => {
const [words, setWords] = useState<WordType[]>([]);

  return (
    <div className='app-container'>
      {/* Pass setWords down so the button can update state */}
      <TextBoxButton setWords={setWords} />

      <Canvas className='full-canvas' camera={{position: [0, 0, 10], fov:90}}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Render word cloud if words exist */}
        {words.length > 0 && <WordCloud words={words} radius={5} />}
      </Canvas>
    </div>
  );
};

export default App;
