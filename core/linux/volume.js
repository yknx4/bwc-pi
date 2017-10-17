const { log } = Math;

module.exports = function volume(val) {
  const v = parseInt(2000 * log(Math.abs(101 - val) / 100));
  if (v > 0) return 0;
  if (v < -2000) return -2000;
  return v;
};
