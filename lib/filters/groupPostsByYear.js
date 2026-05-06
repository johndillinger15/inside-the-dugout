module.exports = function (posts) {
  const grouped = {};

  // Posts neueste zuerst
  const sortedPosts = [...posts].sort((a, b) => b.date - a.date);

  sortedPosts.forEach((post) => {
    const year = new Date(post.date).getFullYear();

    if (!grouped[year]) {
      grouped[year] = [];
    }

    grouped[year].push(post);
  });

  // Jahre neueste zuerst
  return Object.keys(grouped)
    .sort((a, b) => b - a)
    .map((year) => ({
      year,
      posts: grouped[year],
    }));
};
