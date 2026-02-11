import React, { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; // React Three Fiber for 3D rendering
import { Mesh } from 'three'; // Three.js mesh type
import TextBoxButton from "./Components/TextBox&Button"; // Component for URL input and submit button
import WordCloud from './Components/WordCloud'; // Component to render 3D word cloud
import "./App.css"; // Import CSS for styling

// Backend API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Define the TypeScript type for words
export type WordType = {
    word: string;  // The actual word text
    weight: number; // Weight of the word, used for size, color, etc.
}

// Example Box component to demonstrate 3D object rotation
const Box = () => {
  const meshRef = React.useRef<Mesh>(null!); // Reference to the mesh to manipulate it

  // Rotate the box slightly on each frame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* Box geometry with width, height, depth of 1 */}
      <boxGeometry args={[1, 1, 1]} />
      {/* Standard material with orange color */}
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

// Function to fetch word cloud data from backend API
export async function fetchWordCloud(url: string): Promise<WordType[]> {
  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST", // POST request to send the URL to the backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }), // Send the URL as JSON in request body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse response JSON into an array of WordType
    const data: WordType[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching word cloud:", error);
    return []; // Return empty array if request fails
  }
}

// Main App component
const App = () => {
  // State to store list of words for the word cloud
  const [words, setWords] = useState<WordType[]>([]);

  return (
    <div className='app-container'>
      {/* TextBoxButton gets access to setWords so it can update state */}
      <TextBoxButton setWords={setWords} />

      {/* Canvas fills the screen and renders 3D content */}
      <Canvas 
        className='full-canvas' 
        camera={{ position: [0, 0, 10], fov: 90 }} // Camera positioned back along z-axis
      >
        {/* Ambient light for general illumination */}
        <ambientLight intensity={0.5} />
        {/* Point light to give depth/shading to 3D objects */}
        <pointLight position={[10, 10, 10]} />

        {/* Render the word cloud only if there are words */}
        {words.length > 0 && <WordCloud words={words} />}
      </Canvas>
    </div>
  );
};

export default App;
