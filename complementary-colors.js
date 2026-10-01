/* No dependencies. Analyze a small canvas once per image, never per animation frame. */
(function (root) {
  'use strict';
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  function rgbToHsl(rgb) {
    const [r, g, b] = rgb.map(n => n / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min, l = (max + min) / 2;
    if (!d) return [0, 0, l];
    const s = d / (1 - Math.abs(2 * l - 1));
    let h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h * 60, s, l];
  }
  function hslToRgb([h, s, l]) {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(h / 60 % 2 - 1)), m = l - c / 2;
    const rgb = h < 60 ? [c,x,0] : h < 120 ? [x,c,0] : h < 180 ? [0,c,x] : h < 240 ? [0,x,c] : h < 300 ? [x,0,c] : [c,0,x];
    return rgb.map(n => Math.round((n + m) * 255));
  }
  const hex = rgb => '#' + rgb.map(n => Math.round(clamp(n, 0, 255)).toString(16).padStart(2, '0')).join('').toUpperCase();
  function palette(rgb, neutral = false) {
    const [h,s,l] = rgbToHsl(rgb);
    const complement = hslToRgb([(h + 180) % 360, s, l]);
    return { source: hex(rgb), complement: hex(complement), rgb: complement, neutral };
  }
  function analyzePixels(data, options = {}) {
    const bins = Array.from({length: 24}, () => ({weight:0, sum:[0,0,0]}));
    const total = [0,0,0]; let count = 0;
    const minSaturation = options.minSaturation ?? 0.12;
    const power = options.saturationPower ?? 3;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i+3] < 128) continue;
      const rgb = [data[i], data[i+1], data[i+2]];
      rgb.forEach((c,j) => total[j] += c); count++;
      const [h,s,l] = rgbToHsl(rgb);
      // Ignore whites, blacks, and grey. Weight chromatic accents above large muted surfaces.
      if (s < minSaturation || s > (options.maxSaturation ?? 1) || l < (options.minLightness ?? 0.18) || l > (options.maxLightness ?? 0.85) || Math.max(...rgb) - Math.min(...rgb) < 12) continue;
      const bin = bins[Math.floor(h / 15) % 24];
      const weight = Math.pow(s, power);
      bin.weight += weight;
      rgb.forEach((c,j) => bin.sum[j] += c * weight);
    }
    const dominant = bins.reduce((best,b) => b.weight > best.weight ? b : best, bins[0]);
    if (!dominant.weight) {
      // Achromatic photos have no meaningful hue; preserve their neutral character.
      const average = count ? total.map(n => n / count) : [128,128,128];
      const grey = Math.round(average.reduce((a,b) => a+b, 0) / 3);
      return palette([grey,grey,grey], true);
    }
    return palette(dominant.sum.map(n => n / dominant.weight));
  }
  function analyzeImage(image, options = {}) {
    const canvas = document.createElement('canvas');
    const [x,y,w,h] = options.region || [0,0,1,1];
    const sw = image.naturalWidth * w, sh = image.naturalHeight * h;
    const scale = Math.min(1, 160 / Math.max(sw,sh));
    canvas.width = Math.max(1, Math.round(sw * scale));
    canvas.height = Math.max(1, Math.round(sh * scale));
    const ctx = canvas.getContext('2d', {willReadFrequently:true});
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.drawImage(image, image.naturalWidth*x, image.naturalHeight*y, sw, sh, 0,0,canvas.width,canvas.height);
    return analyzePixels(ctx.getImageData(0,0,canvas.width,canvas.height).data, options);
  }
  const api = {rgbToHsl, hslToRgb, hex, palette, analyzePixels, analyzeImage};
  root.YIDColors = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
