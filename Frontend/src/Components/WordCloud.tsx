import Word from "./WordComp"; // Component to render each individual word in 3D
import type { WordType } from "../App"; // Type for words with weight
import { weightToColor } from "../Utilities/Utils"; // Utility function to map weight to color

// Props for the WordCloud component
type WordCloudProps = {
  words: WordType[];         // Array of words to render
  radiusX?: number;          // X-axis radius of the cloud (oval shape)
  radiusY?: number;          // Y-axis radius of the cloud
  radiusZ?: number;          // Z-axis radius of the cloud
};

// Main WordCloud component
export default function WordCloud({ words, radiusX = 5, radiusY = 3, radiusZ = 1.5 }: WordCloudProps) {

  // Find the minimum and maximum word weights to normalize colors
  const minWeight = Math.min(...words.map(w => w.weight));
  const maxWeight = Math.max(...words.map(w => w.weight));

  return (
    <>
      {words.map((w, i) => {
        // Random spherical coordinates
        const theta = Math.random() * Math.PI * 2;       // Azimuthal angle
        const phi = Math.acos(2 * Math.random() - 1);    // Polar angle

        // Convert spherical coordinates to 3D Cartesian coordinates
        const x = radiusX * Math.sin(phi) * Math.cos(theta); // X-position
        const y = radiusY * Math.sin(phi) * Math.sin(theta); // Y-position
        const z = radiusZ;                                   // Z-position (flattened oval)

        // Render each word with its position, weight, and color based on weight
        return (
          <Word
            key={i}
            word={w.word}
            weight={w.weight}
            position={[x, y, z]}
            color={weightToColor(w.weight, minWeight, maxWeight)}
          />
        );
      })}
    </>
  );
}
