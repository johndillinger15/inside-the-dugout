require("dotenv").config();

const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const pluginWebmentions = require("eleventy-plugin-webmentions");

const markdownIt = require("markdown-it");
const markdownItForInline = require("markdown-it-for-inline");

const md = markdownIt({
  html: true,
  linkify: true,
}).use(markdownItForInline, "external_links", "link_open", (tokens, idx) => {
  const hrefAttr = tokens[idx].attrs?.find((attr) => attr[0] === "href");
  if (!hrefAttr) return;

  const href = hrefAttr[1];
  const isExternal = () => {
    try {
      const url = new URL(href, "http://localhost"); // fallback for relative URLs
      return !["inside-the-dugout.de", "localhost"].includes(url.hostname);
    } catch {
      return false;
    }
  };
});

module.exports = (config) => {
  // Add a filter to extract the hostname from a URL
  config.addFilter("urlHostname", function (url) {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch (e) {
      return url;
    }
  });

  // markdown-it
  config.setLibrary("md", md);

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
  config.addFilter("groupBy", require("./lib/filters/groupBy"));

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

  // Webmentions
  config.addPlugin(pluginWebmentions, {
    domain: "inside-the-dugout.de",
    token: process.env.WEBMENTION_IO_TOKEN,
  });

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
