const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

module.exports = (config) => {
  // Passthrough copy
  config.addPassthroughCopy({ "src/posts/img/**/*": "assets/img/" });
  config.addPassthroughCopy("src/rss-style.xsl");
  config.addPassthroughCopy("assets");

  // Watch targets
  config.addWatchTarget("src/assets/js/");

  // Layout aliases
  config.addLayoutAlias("default", "layouts/default.njk");
  config.addLayoutAlias("post", "layouts/post.njk");

  // Filters
  config.addFilter("readableDate", require("./lib/filters/readableDate"));
  config.addFilter("minifyJs", require("./lib/filters/minifyJs"));

  // Transforms
  config.addTransform("minifyHtml", require("./lib/transforms/minifyHtml"));

  // Collections
  config.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/posts/**/*.md");
  });
  config.addCollection("tagList", require("./lib/collections/tagList"));
  config.addCollection("pagedPosts", require("./lib/collections/pagedPosts"));
  config.addCollection(
    "pagedPostsByTag",
    require("./lib/collections/pagedPostsByTag")
  );

  // RSS Plugin
  config.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/feed.rss",
    collection: {
      name: "posts",
      limit: 20,
    },
    metadata: {
      language: "de",
      title: "Inside The Dugout",
      subtitle: "Das wöchentliche MLB Update.",
      base: "https://inside-the-dugout.de",
      author: {
        name: "Stefan Dillinger",
        email: "",
      },
    },
  });

  // Return Eleventy config
  return {
    dir: {
      input: "src",
      output: "dist",
    },
    templateFormats: ["njk", "md", "svg", "jpg", "css", "png", "11ty.js"],
    dataTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
