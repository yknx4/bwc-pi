const { platform } = require("os");
function interpolate(x0, y0, x1, y1, x2) {
  return ((x1 - x2) * y0 + (x2 - x0) * y1) / (x1 - x0);
}

const MAX_VOLUME = parseFloat(process.env.MAX_VOLUME) || 120;
const MIN_VOLUME = parseFloat(process.env.MIN_VOLUME) || 10;
const UPPER_LIMIT = parseFloat(process.env.UPPER_LIMIT) || 80;
const LOWER_LIMIT = parseFloat(process.env.LOWER_LIMIT) || 20;

const volumeForIntensity = dbm =>
  interpolate(LOWER_LIMIT, MIN_VOLUME, UPPER_LIMIT, MAX_VOLUME, dbm * -1);
const normalizedVolume = dbm => {
  const v = volumeForIntensity(dbm);
  console.log(`Volume for ${dbm}dBm is ${v}`);
  if (v < MIN_VOLUME) return MIN_VOLUME;
  if (v > MAX_VOLUME) return MAX_VOLUME;
  return v;
};

module.exports = normalizedVolume;
