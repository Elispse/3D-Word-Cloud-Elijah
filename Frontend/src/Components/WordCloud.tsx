import Word from "./WordComp";
import type { WordType } from "../App";
import { weightToColor } from "../Utilities/Utils";

type WordCloudProps = {
  words: WordType[];
  radiusX?: number;
  radiusY?: number;
  radiusZ?: number;
};

export default function WordCloud({ words, radiusX = 5, radiusY = 3, radiusZ = 1.5 }: WordCloudProps) {

  const minWeight = Math.min(...words.map(w => w.weight));
  const maxWeight = Math.max(...words.map(w => w.weight));


  return (
    <>
      {words.map((w, i) => {
        // random position on a sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = radiusX * Math.sin(phi) * Math.cos(theta);
        const y = radiusY * Math.sin(phi) * Math.sin(theta);
        const z = radiusZ;

        return <Word key={i} word={w.word} weight={w.weight} position={[x, y, z]} color={weightToColor(w.weight, minWeight, maxWeight)} />;
      })}
    </>
  );
}
