const { log } = Math;

module.exports = function volume(val) {
  return 2000 * log10(Math.abs(val));
};
