export enum ChamberType {
  HORIZONTAL = 'HORIZONTAL',
  AERATED = 'AERATED',
  VERTICAL = 'VERTICAL'
}

export interface UserInput {
  q: number; // Design Flow (m3/s)
  kz: number; // Variation Coefficient
  type: ChamberType;
}

export interface HorizontalParams {
  v: number; // Horizontal velocity (m/s)
  t: number; // Residence time (s)
  h2: number; // Effective water depth (m)
  b_grid: number; // Width per grid (m)
  x_grit: number; // Grit quantity (m3/10^6 m3 sewage)
  T_clean: number; // Cleaning interval (days)
}

export interface AeratedParams {
  t: number; // Residence time (min)
  v_horizontal: number; // Horizontal velocity (m/s)
  air_ratio: number; // Air supply rate (m3 air / m3 water)
  width_depth_ratio: number; // b/h ratio
}

export interface VerticalParams {
    v_up: number; // Vertical velocity (m/s)
    t: number; // Residence time (s)
}

export interface CalculationResult {
  length: number;
  totalWidth: number;
  totalDepth: number;
  effectiveDepth: number;
  numChannels?: number; // For horizontal
  volumeGrit?: number;
  airSupply?: number; // For aerated
  diameter?: number; // For vertical
}