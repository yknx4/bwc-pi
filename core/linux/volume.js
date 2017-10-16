const { log } = Math;

module.exports = function volume(val) {
  return 100 - parseInt(2000 * log(Math.abs(val) / 100));
};
