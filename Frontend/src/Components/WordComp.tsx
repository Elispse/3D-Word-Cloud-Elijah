import { Text } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import type { Mesh } from "three";


type WordProps = {
  word: string;
  weight: number;
  position: [number, number, number];
};

export default function Word({ word, weight, position }: WordProps) {
  const ref = useRef<Mesh>(null!);
  const floatSpeed = 0.5 + Math.random(); // random float speed
  const floatAmplitude = 0.2 + Math.random() * 0.5; // float distance

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * floatSpeed;
      ref.current.position.y = position[1] + Math.sin(t) * floatAmplitude;
      ref.current.position.x = position[0] + Math.cos(t / 2) * floatAmplitude;
      ref.current.rotation.y = Math.sin(t / 3) * 0.2; // slight rotation
    }
  });

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={weight * 0.2} // scale size by weight
      color="orange"
      anchorX="center"
      anchorY="middle"
    >
      {word}
    </Text>
  );
}