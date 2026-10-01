/* Add a photo here; the complementary color is calculated automatically.
   region is an optional [x, y, width, height] normalized artwork crop for analysis only.
   All displayed photos are centered; object-fit: cover scales them proportionally to fill the viewport.
   color overrides the extracted complement; fallback is used only if canvas reading fails. */
window.YID_HOME_SLIDES = [
  { src: './assets/home/music-poster.webp', position: 'center center', color: '#1D79FF', fallback: '#1D79FF', analysis: {minSaturation:0.2, saturationPower:1} },
  { src: './assets/home/fashion.webp', position: 'center center', fallback: '#1E968F', analysis: {minSaturation:0.2, saturationPower:4} },
  { src: './assets/home/textile.webp', position: 'center center', fallback: '#929FAA', analysis: {region:[0.1,0.46,0.29,0.2], minSaturation:0.08, maxSaturation:0.35, minLightness:0.5, saturationPower:1} },
  { src: './assets/home/fashion-meadow.webp', position: 'center center', fallback: '#3E214F', analysis: {minSaturation:0.25, saturationPower:1} },
  // Sample the color poster rather than the surrounding grey wall.
  { src: './assets/home/uprising-posters.webp', position: 'center center', fallback: '#0E7375', analysis: {region:[0.56,0.26,0.27,0.53], minSaturation:0.25, minLightness:0.12, saturationPower:3} }
];
