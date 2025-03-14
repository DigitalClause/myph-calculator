
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
 * Calculate pH from hydroxide ion concentration (OH⁻)
 * pOH = -log10([OH⁻])
 * pH = 14 - pOH
 */
export const calculatePHFromOH = (hydroxideConcentration: number): number => {
  if (hydroxideConcentration <= 0) {
    throw new Error("Hydroxide ion concentration must be greater than 0");
  }
  
  // pOH = -log10([OH⁻])
  const pOH = -Math.log10(hydroxideConcentration);
  
  // pH = 14 - pOH
  const pH = 14 - pOH;
  
  // Constrain pH to the standard 0-14 scale
  return Math.max(0, Math.min(14, pH));
};

/**
 * Calculate pH from pOH value
 * pH = 14 - pOH
 */
export const calculatePHFromPOH = (pOH: number): number => {
  if (pOH < 0 || pOH > 14) {
    throw new Error("pOH must be between 0 and 14");
  }
  
  // pH = 14 - pOH
  const pH = 14 - pOH;
  
  // Return calculated pH value
  return pH;
};

/**
 * Calculate hydrogen ion concentration from pH
 * [H+] = 10^(-pH)
 */
export const calculateHydrogenConcentration = (pH: number): number => {
  if (pH < 0 || pH > 14) {
    throw new Error("pH must be between 0 and 14");
  }
  
  // [H+] = 10^(-pH)
  return Math.pow(10, -pH);
};

/**
 * Calculate hydroxide ion concentration from pH
 * [OH⁻] = 10^(-(14-pH))
 */
export const calculateHydroxideConcentration = (pH: number): number => {
  if (pH < 0 || pH > 14) {
    throw new Error("pH must be between 0 and 14");
  }
  
  // [OH⁻] = 10^(-(14-pH))
  // or [OH⁻] = 10^(pH-14)
  return Math.pow(10, pH - 14);
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

/**
 * Common acids and bases with their typical pH values
 */
export interface Solution {
  name: string;
  type: "acid" | "base";
  typicalPH: number;
  formula?: string;
  description?: string;
}

export const commonSolutions: Solution[] = [
  // Acids
  { name: "Battery Acid", type: "acid", typicalPH: 0.5, formula: "H₂SO₄", description: "Sulfuric acid used in car batteries" },
  { name: "Gastric Acid", type: "acid", typicalPH: 1.5, formula: "HCl", description: "Found in stomach acid" },
  { name: "Lemon Juice", type: "acid", typicalPH: 2.4, formula: "C₆H₈O₇", description: "Citric acid in lemons" },
  { name: "Vinegar", type: "acid", typicalPH: 2.8, formula: "CH₃COOH", description: "Acetic acid in vinegar" },
  { name: "Orange Juice", type: "acid", typicalPH: 3.5, description: "Citrus juice" },
  { name: "Tomato Juice", type: "acid", typicalPH: 4.3, description: "Slightly acidic fruit juice" },
  { name: "Black Coffee", type: "acid", typicalPH: 5.0, description: "Brewed coffee without additives" },
  { name: "Urine", type: "acid", typicalPH: 6.0, description: "Human urine is slightly acidic" },
  { name: "Milk", type: "acid", typicalPH: 6.5, description: "Slightly acidic dairy product" },
  
  // Neutral
  { name: "Pure Water", type: "base", typicalPH: 7.0, formula: "H₂O", description: "Completely neutral" },
  
  // Bases
  { name: "Blood", type: "base", typicalPH: 7.4, description: "Slightly basic human blood" },
  { name: "Seawater", type: "base", typicalPH: 8.0, description: "Slightly basic ocean water" },
  { name: "Baking Soda", type: "base", typicalPH: 9.0, formula: "NaHCO₃", description: "Sodium bicarbonate solution" },
  { name: "Milk of Magnesia", type: "base", typicalPH: 10.5, formula: "Mg(OH)₂", description: "Magnesium hydroxide antacid" },
  { name: "Household Ammonia", type: "base", typicalPH: 11.0, formula: "NH₃", description: "Cleaning solution" },
  { name: "Bleach", type: "base", typicalPH: 12.5, formula: "NaClO", description: "Sodium hypochlorite cleaner" },
  { name: "Drain Cleaner", type: "base", typicalPH: 14.0, formula: "NaOH", description: "Sodium hydroxide-based cleaner" },
];
