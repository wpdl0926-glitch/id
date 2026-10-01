/* Add a photo here; the complementary color is calculated automatically.
   region is an optional [x, y, width, height] normalized artwork crop for analysis only.
   All displayed photos are centered; object-fit: cover scales them proportionally to fill the viewport. fallback is used only if canvas reading fails. */
window.YID_HOME_SLIDES = [
  { src: './assets/home/music-poster.webp', position: 'center center', fallback: '#A3ADDD', analysis: {minSaturation:0.2, saturationPower:1} },
  { src: './assets/home/fashion.webp', position: 'center center', fallback: '#1E968F', analysis: {minSaturation:0.2, saturationPower:4} },
  { src: './assets/home/textile.webp', position: 'center center', fallback: '#929FAA', analysis: {region:[0.1,0.46,0.29,0.2], minSaturation:0.08, maxSaturation:0.35, minLightness:0.5, saturationPower:1} }
];
