"use client";

import { useState } from 'react';
import styles from './styles.module.scss';

const MIN_K = 0;
const MAX_K = 6500;

function kToC(k) { return Math.round(k - 273.15); }
function kToF(k) { return Math.round((k - 273.15) * 9 / 5 + 32); }
function cToK(c) { return Math.round(c + 273.15); }
function fToK(f) { return Math.round((f - 32) * 5 / 9 + 273.15); }

function clampK(k) { return Math.max(MIN_K, Math.min(MAX_K, k)); }

function displayValue(k, unit) {
  if (unit === 'C') return kToC(k);
  if (unit === 'F') return kToF(k);
  return k;
}

export default function TemperatureSlider({ temperature, setTemperature }) {
  const [mobileUnit, setMobileUnit] = useState('K');

  const handleSliderChange = (e) => {
    setTemperature(Number(e.target.value));
  };

  const handleInput = (e, unit) => {
    const val = Number(e.target.value);
    if (isNaN(val)) return;
    if (unit === 'K') setTemperature(clampK(val));
    if (unit === 'C') setTemperature(clampK(cToK(val)));
    if (unit === 'F') setTemperature(clampK(fToK(val)));
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        <span className={styles.labelFull}>Temperature</span>
        <span className={styles.labelShort}>Temp.</span>
      </label>

      <div className={styles.sliderContainer}>
        <input
          type="range"
          min={MIN_K}
          max={MAX_K}
          value={temperature}
          onChange={handleSliderChange}
          className={styles.slider}
        />
      </div>

      <div className={styles.stepBtns}>
        <button
          className={styles.stepBtn}
          onClick={() => setTemperature(Math.max(MIN_K, temperature - 50))}
        >
          &minus;
        </button>
        <button
          className={styles.stepBtn}
          onClick={() => setTemperature(Math.min(MAX_K, temperature + 50))}
        >
          +
        </button>
      </div>

      {/* Desktop: show all three values */}
      <div className={styles.readout}>
        <div className={styles.readoutGroup}>
          <input
            type="number"
            className={styles.valueInput}
            value={temperature}
            onChange={(e) => handleInput(e, 'K')}
          />
          <span className={styles.unit}>K</span>
        </div>
        <div className={styles.readoutGroup}>
          <input
            type="number"
            className={styles.valueInput}
            value={kToC(temperature)}
            onChange={(e) => handleInput(e, 'C')}
          />
          <span className={styles.unit}>°C</span>
        </div>
        <div className={styles.readoutGroup}>
          <input
            type="number"
            className={`${styles.valueInput} ${styles.valueInputWide}`}
            value={kToF(temperature)}
            onChange={(e) => handleInput(e, 'F')}
          />
          <span className={styles.unit}>°F</span>
        </div>
      </div>

      {/* Mobile: single value with unit selector */}
      <div className={styles.readoutMobile}>
        <input
          type="number"
          className={`${styles.valueInput} ${styles.valueInputWide}`}
          value={displayValue(temperature, mobileUnit)}
          onChange={(e) => handleInput(e, mobileUnit)}
        />
        <select
          className={styles.unitSelect}
          value={mobileUnit}
          onChange={(e) => setMobileUnit(e.target.value)}
        >
          <option value="K">K</option>
          <option value="C">°C</option>
          <option value="F">°F</option>
        </select>
      </div>
    </div>
  );
}
