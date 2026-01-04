module.exports = {
  layout: "layouts/shortpost.njk",

  permalink: (data) => {
    const d = data.page.date;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `/shortposts/${year}/${month}/${day}/${data.page.fileSlug}/`;
  },
};
