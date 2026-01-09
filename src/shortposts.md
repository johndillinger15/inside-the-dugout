---
title: Shortposts
permalink: /shortposts/
layout: layouts/default.njk
---

<div class="mx-auto max-w-2xl mb-6">
  <div class="rounded-sm border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
    <p>
      Kurze Updates und Gedanken rund um die MLB, die nicht für einen Blogartikel gereicht haben.
    </p>
    <p class="mt-2">
      <a href="/shortposts/feed.xml"
         class="font-medium hover:underline"
         style="color:#C8102E">
        → Shortposts per RSS abonnieren
      </a>
    </p>
  </div>
</div>

<div class="mx-auto max-w-2xl">
  {% for post in collections.shortposts %}
    {% include "partials/shortpost-card.njk" %}
  {% endfor %}
</div>
