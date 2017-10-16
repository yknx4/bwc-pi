const { log } = Math;

module.exports = function volume(val) {
  return parseInt(2000 * log(Math.abs(val) / 100));
};
