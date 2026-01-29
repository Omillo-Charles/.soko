/**
 * Calculates the shipping fee based on the order subtotal.
 * 
 * Rules:
 * - 0 – 499: 50
 * - 500 – 999: 100
 * - 1,000 – 1,999: 200
 * - 2,000 – 2,999: 300
 * - 3,000 – 3,999: 400
 * - 4,000 – 4,999: 500
 * - 5,000 – 5,999: 600
 * - 6,000 – 6,999: 700
 * - 7,000 – 7,999: 800
 * - 8,000 – 8,999: 900
 * - 9,000 – 9,999: 999
 * - 10,000 – 30,000: 1,500 (flat)
 * - 30,000+: Seasonal Offer (Free once per season)
 * 
 * @param subtotal The order subtotal in KES
 * @returns The shipping fee in KES
 */
export const calculateShippingFee = (subtotal: number): number => {
  if (subtotal <= 0) return 0;
  if (subtotal < 500) return 50;
  if (subtotal < 1000) return 100;
  if (subtotal < 2000) return 200;
  if (subtotal < 3000) return 300;
  if (subtotal < 4000) return 400;
  if (subtotal < 5000) return 500;
  if (subtotal < 6000) return 600;
  if (subtotal < 7000) return 700;
  if (subtotal < 8000) return 800;
  if (subtotal < 9000) return 900;
  if (subtotal < 10000) return 999;
  if (subtotal < 30000) return 1500;
  return 0; // Free once per season for 30,000+
};
