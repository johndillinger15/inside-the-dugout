require("dotenv").config();

const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const pluginWebmentions = require("eleventy-plugin-webmentions");

const markdownIt = require("markdown-it");
const markdownItForInline = require("markdown-it-for-inline");

const tailwindcss = require("eleventy-plugin-tailwindcss-4");

// Configure markdown-it with external link handling
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

  if (isExternal()) {
    const url = new URL(href, "http://localhost");
    const hostname = url.hostname.replace("www.", "");

    // Add class="external-link"
    let classAttr = tokens[idx].attrs.find((attr) => attr[0] === "class");
    if (classAttr) {
      classAttr[1] += " external-link";
    } else {
      tokens[idx].attrs.push(["class", "external-link"]);
    }

    // Add target and rel attributes
    tokens[idx].attrs.push(["target", "_blank"]);
    tokens[idx].attrs.push(["rel", "noopener noreferrer"]);

    // Add Umami tracking attribute with dynamic hostname
    tokens[idx].attrs.push(["data-umami-event", `Click to ${hostname}`]);
  }
});

module.exports = (config) => {
  // Add the Markdown parser with external link handling
  config.setLibrary("md", md);

  // Optional: A filter to extract hostnames from URLs
  config.addFilter("urlHostname", function (url) {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch (e) {
      return url;
    }
  });

  // Tailwind plugiin
  config.addPlugin(tailwindcss, {
    input: "assets/css/main.css", // required
  });

  // markdown-it
  config.setLibrary("md", md);

  // Passthrough copy
  config.addPassthroughCopy({ "src/posts/img/**/*": "assets/img/" });
  config.addPassthroughCopy("src/rss-style.xsl");
  config.addPassthroughCopy("src/assets");

  // Watch targets
  config.addWatchTarget("src/assets/js/");

  // Layout aliases
  config.addLayoutAlias("default", "layouts/default.njk");
  config.addLayoutAlias("post", "layouts/post.njk");
  config.addLayoutAlias("shortpost", "layouts/shortpost.njk");

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
  config.addCollection("shortposts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("./src/shortposts/**/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Home feed collection
  config.addCollection("homeFeed", function (collectionApi) {
    const posts = collectionApi
      .getFilteredByGlob("./src/posts/**/*.md")
      .sort((a, b) => b.date - a.date)
      .slice(0, 3);

    const shortposts = collectionApi
      .getFilteredByGlob("./src/shortposts/**/*.md")
      .sort((a, b) => b.date - a.date)
      .slice(0, 3);

    return {
      posts,
      shortposts,
    };
  });

  // Combined collection
  config.addCollection("combined", function (collectionApi) {
  return [
    ...collectionApi.getFilteredByGlob("./src/posts/**/*.md"),
    ...collectionApi.getFilteredByGlob("./src/shortposts/**/*.md"),
  ].sort((a, b) => b.date - a.date);
});

  config.addFilter("plainExcerpt", function (html, length = 700) {
    if (!html) return "";

    const text = html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Decode basic HTML entities
    const decoded = text
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    return decoded.slice(0, length);
  });

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
