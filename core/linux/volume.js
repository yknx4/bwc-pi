const { log } = Math;

module.exports = function volume(val) {
  const v = parseInt(2000 * log(Math.abs(100 - val) / 100));
  console.log(v);
  if (v > 0) return 0;
  if (v < -4000) return -4000;
  return 0;
};
