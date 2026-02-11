import { Text } from "@react-three/drei"; // 3D text component for React Three Fiber
import { useRef } from "react";
import { useFrame } from "@react-three/fiber"; // hook to run code every frame
import type { Mesh } from "three"; // type for ref

// Props for a single word in the word cloud
type WordProps = {
  word: string;                  // The text of the word
  weight: number;                // Determines size of the word
  position: [number, number, number]; // Initial 3D position
  color: string;                 // Text color, usually mapped from weight
};

export default function Word({ word, weight, position, color }: WordProps) {
  // Ref to manipulate the text mesh directly
  const ref = useRef<Mesh>(null!);

  // Randomize float speed and amplitude for a natural "floating" effect
  const floatSpeed = 0.5 + Math.random();          // How fast the word floats
  const floatAmplitude = 0.2 + Math.random() * 0.5; // How far it moves

  // Called every frame (~60fps)
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * floatSpeed; // elapsed time scaled by speed

      // Float the word in a sine/cos pattern
      ref.current.position.y = position[1] + Math.sin(t) * floatAmplitude;
      ref.current.position.x = position[0] + Math.cos(t / 2) * floatAmplitude;

      // Slight rotation for more dynamic motion
      ref.current.rotation.y = Math.sin(t / 3) * 0.2;
    }
  });

  // Render the text in 3D space
  return (
    <Text
      ref={ref}
      position={position}          // Base position (modified by useFrame)
      fontSize={weight * 0.2}      // Scale size by weight
      color={color}                // Use color from weight mapping
      anchorX="center"             // Center alignment horizontally
      anchorY="middle"             // Center alignment vertically
    >
      {word}
    </Text>
  );
}
