module.exports = {
  layout: "post",
  title: "Untitled",
  eleventyComputed: {
    permalink: (data) => {
      const year = data.page.date.getFullYear();
      return `posts/${year}/${data.page.fileSlug}/index.html`;
    },
    thumb: (data) => {
      if (data.thumb) {
        if (/^https?:\/\//.test(data.thumb)) {
          return data.thumb;
        }
        return `/assets/img/${data.thumb}`;
      } else {
        return false;
      }
    },
  },
};
