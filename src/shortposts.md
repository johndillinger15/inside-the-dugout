---
title: Shortposts
permalink: /shortposts/
layout: layouts/default.njk
---

<div class="mx-auto max-w-2xl space-y-4">
  {% for post in collections.shortposts %}
    {% include "partials/shortpost-card.njk" %}
  {% endfor %}
</div>
