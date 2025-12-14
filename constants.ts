import { HorizontalParams, AeratedParams, VerticalParams } from './types';

// Based on PDF Section 5.2.2.1
export const DEFAULT_HORIZONTAL_PARAMS: HorizontalParams = {
  v: 0.25,      // Range 0.15 - 0.3 m/s (Example uses 0.25)
  t: 30,        // Range 30 - 60s
  h2: 1.0,      // Range 0.25 - 1.2m (Example uses 0.67 approx, we default to 1.0)
  b_grid: 0.6,  // Min 0.6m
  x_grit: 30,   // 30 m3 per 10^6 m3 sewage
  T_clean: 2,   // Days between cleaning (Example uses 2)
};

// Based on PDF Section 5.2.4.1
export const DEFAULT_AERATED_PARAMS: AeratedParams = {
  t: 2,               // Range 1-3 min (Example uses 2)
  v_horizontal: 0.1,  // Range 0.06 - 0.12 m/s (Example uses 0.1)
  air_ratio: 0.2,     // 0.2 m3 air per m3 water
  width_depth_ratio: 1.5 // Range 1-2 (Calculated B/H)
};

// Based on PDF Section 5.2.3
export const DEFAULT_VERTICAL_PARAMS: VerticalParams = {
    v_up: 0.05, // Range 0.02 - 0.1 m/s
    t: 30,      // Range 30 - 60s
}

export const FREEBOARD = 0.3; // m (Standard freeboard h1)
export const GRIT_CHAMBER_SLOPE = 0.06; // Slope i
