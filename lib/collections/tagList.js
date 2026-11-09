function fromEntries(iterable) {
  return [...iterable].reduce((obj, [key, val]) => {
    obj[key] = val;

    return obj;
  }, {});
}

/* Collection output format:
{
  tagName: numberOfPostsWithTagName,
  ...
}
Tags werden nur noch aus den Shortposts gesammelt (Blogartikel haben keine Tag-Seiten mehr).
*/
module.exports = (coll) => {
  const shortposts = coll.getFilteredByGlob("./src/shortposts/**/*.md");

  const tagListArr = shortposts
    .reduce((tags, post) => {
      if ("tags" in post.data) {
        tags = tags.concat(post.data.tags);
      }

      return [...new Set(tags)];
    }, [])
    .map((tag) => [tag, coll.getFilteredByTag(tag).length])
    .sort((a, b) => b[1] - a[1]);

  return fromEntries(tagListArr);
};
