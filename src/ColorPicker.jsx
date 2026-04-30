import { useState, useCallback } from 'react';
import './ColorPicker.css';

const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const hexToHsl = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const ColorPicker = ({ value, onChange }) => {
  const [hsl, setHsl] = useState(() => hexToHsl(value));
  const [hexInput, setHexInput] = useState(value);

  // Compute gradient backgrounds for sliders
  const hueGradient = `
    linear-gradient(
      90deg,
      hsl(0, 100%, 50%),
      hsl(60, 100%, 50%),
      hsl(120, 100%, 50%),
      hsl(180, 100%, 50%),
      hsl(240, 100%, 50%),
      hsl(300, 100%, 50%),
      hsl(360, 100%, 50%)
    )
  `;

  const sCenter = hsl.s;
  const sLeft = Math.max(0, sCenter - 50);
  const sRight = Math.min(100, sCenter + 50);
  const saturationGradient = `
    linear-gradient(
      90deg,
      hsl(${hsl.h}, ${sLeft}%, ${hsl.l}%) 0%,
      hsl(${hsl.h}, ${sCenter}%, ${hsl.l}%) 50%,
      hsl(${hsl.h}, ${sRight}%, ${hsl.l}%) 100%
    )
  `;

  const lCenter = hsl.l;
  const lLeft = Math.max(0, lCenter - 50);
  const lRight = Math.min(100, lCenter + 50);
  const lightnessGradient = `
    linear-gradient(
      90deg,
      hsl(${hsl.h}, ${hsl.s}%, ${lLeft}%) 0%,
      hsl(${hsl.h}, ${hsl.s}%, ${lCenter}%) 50%,
      hsl(${hsl.h}, ${hsl.s}%, ${lRight}%) 100%
    )
  `;

  const applyChange = useCallback((newHsl) => {
    setHsl(newHsl);
    const hex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setHexInput(hex);
    onChange(hex);
  }, [onChange]);

  const handleHueChange = (e) => {
    const h = parseInt(e.target.value, 10);
    applyChange({ ...hsl, h });
  };

  const handleSaturationChange = (e) => {
    const s = parseInt(e.target.value, 10);
    applyChange({ ...hsl, s });
  };

  const handleLightnessChange = (e) => {
    const l = parseInt(e.target.value, 10);
    applyChange({ ...hsl, l });
  };

  const handleHexChange = (e) => {
    const v = e.target.value;
    setHexInput(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      applyChange(hexToHsl(v));
    }
  };

  return (
    <div className="color-picker">
      <div className="color-picker-row">
        <label className="color-picker-label">Hue</label>
        <input
          type="range"
          min="0"
          max="360"
          value={hsl.h}
          onChange={handleHueChange}
          className="color-picker-slider"
          style={{ background: hueGradient }}
        />
      </div>
      <div className="color-picker-row">
        <label className="color-picker-label">Saturation</label>
        <input
          type="range"
          min="0"
          max="100"
          value={hsl.s}
          onChange={handleSaturationChange}
          className="color-picker-slider"
          style={{ background: saturationGradient }}
        />
      </div>
      <div className="color-picker-row">
        <label className="color-picker-label">Lightness</label>
        <input
          type="range"
          min="0"
          max="100"
          value={hsl.l}
          onChange={handleLightnessChange}
          className="color-picker-slider"
          style={{ background: lightnessGradient }}
        />
      </div>
      <div className="color-picker-footer">
        <div className="color-picker-preview" style={{ backgroundColor: value }} />
        <input
          className="color-picker-hex"
          value={hexInput}
          onChange={handleHexChange}
          maxLength={7}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
