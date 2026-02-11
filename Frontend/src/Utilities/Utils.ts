export function weightToColor(weight: number, minWeight: number, maxWeight: number) {
  // normalize weight 0–1
  const t = (weight - minWeight) / (maxWeight - minWeight);
  
  // Hue fixed at blue, saturation full
  const hue = 210; // deep blue
  const saturation = 100;

  // Lightness: heavier words darker
  const lightness = 80 - t * 50; // 80% (light) → 30% (dark)
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
