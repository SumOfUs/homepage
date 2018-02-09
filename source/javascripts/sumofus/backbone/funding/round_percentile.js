const roundPercentile = function(x, y, decimals) {
  const value = 100 * (x / y);
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

module.exports = roundPercentile;
