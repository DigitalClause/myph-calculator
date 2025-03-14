
/**
 * Calculate pH value from hydrogen ion concentration
 * pH = -log10([H+])
 */
export const calculatePH = (hydrogenConcentration: number): number => {
  if (hydrogenConcentration <= 0) {
    throw new Error("Hydrogen ion concentration must be greater than 0");
  }
  
  // pH = -log10([H+])
  const pH = -Math.log10(hydrogenConcentration);
  
  // Constrain pH to the standard 0-14 scale
  // In reality, pH can go outside this range in extreme cases,
  // but for most practical purposes it's between 0-14
  return Math.max(0, Math.min(14, pH));
};

/**
 * Get a color representing the pH value on a gradient scale
 * - Red (acidic): pH 0-6
 * - Green (neutral): pH 7
 * - Blue (basic): pH 8-14
 */
export const getPhColor = (pH: number): string => {
  // Ensure pH is within 0-14 range
  const constrainedPH = Math.max(0, Math.min(14, pH));
  
  // Colors for the pH scale
  if (constrainedPH < 3) {
    // Strong acid: deep red
    return "#d70000";
  } else if (constrainedPH < 6) {
    // Weak acid: orange to yellow
    // Interpolate between orange and yellow
    const t = (constrainedPH - 3) / 3;  // 0 to 1
    const r = Math.round(215 + t * 40);
    const g = Math.round(100 + t * 155);
    const b = Math.round(0);
    return `rgb(${r}, ${g}, ${b})`;
  } else if (constrainedPH < 7) {
    // Near neutral (slightly acidic): light green-yellow
    return "#e0f57c";
  } else if (constrainedPH === 7) {
    // Neutral: green
    return "#7ceb7c";
  } else if (constrainedPH < 9) {
    // Slightly basic: light blue
    return "#7cd6f5";
  } else if (constrainedPH < 12) {
    // Moderately basic: medium blue
    return "#0088cc";
  } else {
    // Strong base: deep blue/purple
    return "#0000cc";
  }
};
