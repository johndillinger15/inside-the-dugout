const formats = require("../../src/_data/formats");

module.exports = (coll) => {
  const result = {};
  for (const slug of Object.keys(formats)) {
    const count = coll.getFilteredByTag(slug).length;
    if (count > 0) {
      result[slug] = count;
    }
  }
  return result;
};
