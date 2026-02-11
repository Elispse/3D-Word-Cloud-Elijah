import Word from "./WordComp";
import type { WordType } from "../App";

type WordCloudProps = {
  words: WordType[];
  radius?: number;
};

export default function WordCloud({ words, radius = 5 }: WordCloudProps) {
  return (
    <>
      {words.map((w, i) => {
        // random position on a sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        return <Word key={i} word={w.word} weight={w.weight} position={[x, y, z]} />;
      })}
    </>
  );
}
