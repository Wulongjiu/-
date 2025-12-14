import { 
  HorizontalParams, 
  AeratedParams, 
  VerticalParams,
  CalculationResult, 
  UserInput 
} from '../types';
import { FREEBOARD } from '../constants';

/**
 * Calculates Horizontal Flow Grit Chamber (Based on PDF Page 2-4)
 */
export const calculateHorizontal = (
  input: UserInput, 
  params: HorizontalParams
): CalculationResult & { details: any } => {
  const { q: Q_max, kz: K_z } = input;
  const { v, t, h2, b_grid, x_grit, T_clean } = params;

  // 1. Length (L = v * t)
  const L = v * t;

  // 2. Cross-sectional Area (A = Q_max / v)
  const A = Q_max / v;

  // 3. Total Width needed (B_total = A / h2)
  const B_calc = A / h2;

  // 4. Number of grids/channels (n = B_total / b_grid) -> Round up
  const n = Math.ceil(B_calc / b_grid);
  
  // Recalculate actual Total Width
  const B_actual = n * b_grid;

  // 5. Grit Volume (V = (Q_max * X * T * 86400) / (K_z * 10^6))
  // PDF Page 4, Step 5 Formula. Note: Q_max/K_z approximates Q_avg
  const V_grit = (Q_max * x_grit * T_clean * 86400) / (K_z * 1000000);

  // 6. Grit Hopper Depth (Approximate based on V_grit and geometry)
  // Simplified assumption for total depth calculation:
  // H = h_freeboard + h_effective + h_grit_storage
  // h_grit_storage is roughly V_grit / (L * B_actual) assuming flat distribution for simplicity in this general tool, 
  // though real design uses hoppers. 
  // The PDF Example 1 adds h3 (grit depth) approx 0.51m. 
  // We will estimate h3 based on volume needed spread over area.
  const h3_est = Math.max(0.4, V_grit / (L * B_actual) + 0.2); // Min 0.4m depth for hopper

  const H_total = FREEBOARD + h2 + h3_est;

  return {
    length: parseFloat(L.toFixed(2)),
    totalWidth: parseFloat(B_actual.toFixed(2)),
    totalDepth: parseFloat(H_total.toFixed(2)),
    effectiveDepth: h2,
    numChannels: n,
    volumeGrit: parseFloat(V_grit.toFixed(3)),
    details: {
      area: parseFloat(A.toFixed(2)),
      gritDepth: parseFloat(h3_est.toFixed(2)),
      velocityCheck: v
    }
  };
};

/**
 * Calculates Aerated Grit Chamber (Based on PDF Page 7-9)
 */
export const calculateAerated = (
  input: UserInput,
  params: AeratedParams
): CalculationResult & { details: any } => {
  const { q: Q_max } = input;
  const { t, v_horizontal, air_ratio, width_depth_ratio } = params;

  // 1. Total Volume (V = Q_max * t * 60)
  // t is in minutes
  const V_total = Q_max * t * 60;

  // 2. Cross-sectional Area (A = Q_max / v_horizontal)
  const A = Q_max / v_horizontal;

  // 3. Length (L = V_total / A)
  const L = V_total / A;

  // 4. Dimensions (Width B and Depth h2)
  // A = B * h2 and B/h2 = ratio
  // A = (ratio * h2) * h2 = ratio * h2^2
  // h2 = sqrt(A / ratio)
  const h2 = Math.sqrt(A / width_depth_ratio);
  const B = width_depth_ratio * h2;

  // 5. Air Supply (q_air = d * Q_max * 3600)
  // d = 0.2 m3/m3 (air_ratio)
  const airSupplyPerHour = air_ratio * Q_max * 3600;

  // Total Depth (Freeboard + Effective + Grit Sump)
  // PDF example uses specific hopper design, we assume a sump depth ~0.5m
  const H_total = FREEBOARD + h2 + 0.5; 

  return {
    length: parseFloat(L.toFixed(2)),
    totalWidth: parseFloat(B.toFixed(2)),
    totalDepth: parseFloat(H_total.toFixed(2)),
    effectiveDepth: parseFloat(h2.toFixed(2)),
    airSupply: parseFloat(airSupplyPerHour.toFixed(1)),
    details: {
      volume: parseFloat(V_total.toFixed(1)),
      area: parseFloat(A.toFixed(2))
    }
  };
};

/**
 * Calculates Vertical Flow Grit Chamber (Based on PDF Page 5-6)
 */
export const calculateVertical = (
    input: UserInput,
    params: VerticalParams
): CalculationResult & { details: any } => {
    const { q: Q_max } = input;
    const { v_up, t } = params;

    // Based on Table 5-7
    // 2. Tank Diameter D = sqrt( (4 * Q_max * (v1 + v2)) / (pi * v1 * v2) ) 
    // Simplified model from common practice and Table 5-7 logic:
    // Area A = Q_max / v_up
    // D = sqrt(4 * A / pi)
    const A = Q_max / v_up;
    const D = Math.sqrt((4 * A) / Math.PI);

    // 3. Water Depth h2 = v_up * t (Wait, PDF says h2 = v2 * t where v2 is rising velocity?)
    // Table 5-7, Item 3: h2 = v2 * t. Yes.
    const h2 = v_up * t;

    // Total H approx (Freeboard + h2 + h4 grit cone)
    // Cone height h4 = (R - r) * tan(alpha). Assume alpha 55 deg.
    // Let's approximate cone height as D/2 for simplicity in this visual tool
    const h4 = (D / 2);
    const H_total = FREEBOARD + h2 + h4;

    return {
        length: parseFloat(D.toFixed(2)), // Representing Diameter
        totalWidth: parseFloat(D.toFixed(2)), // Representing Diameter
        diameter: parseFloat(D.toFixed(2)),
        effectiveDepth: parseFloat(h2.toFixed(2)),
        totalDepth: parseFloat(H_total.toFixed(2)),
        details: {
            area: parseFloat(A.toFixed(2))
        }
    }
}
