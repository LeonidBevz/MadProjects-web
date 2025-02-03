const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  };
  
  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };
  
  const mixHexColors = (hex1, hex2) => {
    const [r1, g1, b1] = hexToRgb(hex1);
    const [r2, g2, b2] = hexToRgb(hex2);
  
    const r = Math.round(r1 * 0.93 + r2 * 0.07);
    const g = Math.round(g1 * 0.93  + g2 * 0.07);
    const b = Math.round(b1 * 0.93  + b2 * 0.07);
  
    return rgbToHex(r, g, b);
  };

export default mixHexColors