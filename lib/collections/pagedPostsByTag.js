const siteData = require("../../src/_data/site");
const formats = require("../../src/_data/formats");

module.exports = (coll) => {
  const tagList = require("./tagList")(coll);
  const formatSlugs = Object.keys(formats);

  const maxPostsPerPage = siteData.paginate;
  const pagedPosts = [];

  // Tag- und Format-Slugs zusammenführen, dedupliziert
  const allTagNames = [...new Set([...Object.keys(tagList), ...formatSlugs])];

  allTagNames.forEach((tagName) => {
    const taggedPosts = [...coll.getFilteredByTag(tagName)].reverse();
    if (taggedPosts.length === 0) return;

    const numberOfPages = Math.ceil(taggedPosts.length / maxPostsPerPage);

    for (let pageNum = 1; pageNum <= numberOfPages; pageNum++) {
      const sliceFrom = (pageNum - 1) * maxPostsPerPage;
      const sliceTo = sliceFrom + maxPostsPerPage;

      pagedPosts.push({
        tagName,
        number: pageNum,
        posts: taggedPosts.slice(sliceFrom, sliceTo),
        first: pageNum === 1,
        last: pageNum === numberOfPages,
      });
    }
  });

  return pagedPosts;
};
