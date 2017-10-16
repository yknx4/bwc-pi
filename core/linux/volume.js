const { log } = Math;

module.exports = function volume(val) {
  console.log(`Linux volume of ${val}`);
  return 2000 * log(Math.abs(val));
};
