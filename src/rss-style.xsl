<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>

  <xsl:template match="/">
    <html lang="de">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>RSS Feed · <xsl:value-of select="/rss/channel/title"/></title>
        <style type="text/css">
          * { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
            background: #F9F9F9;
            color: #1D2D50;
            line-height: 1.6;
            padding: 1.5rem 1rem 3rem;
          }

          .page { max-width: 720px; margin: 0 auto; }

          /* Header */
          .header {
            padding: 0.5rem 0 1.75rem;
            border-bottom: 2px solid #C8102E;
            margin-bottom: 2rem;
            display: flex;
            align-items: baseline;
            gap: 0.75rem;
            flex-wrap: wrap;
          }
          .brand-name {
            font-size: 1.375rem;
            font-weight: 800;
            color: #1D2D50;
            letter-spacing: -0.01em;
          }
          .brand-tag {
            font-size: 0.6875rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #C8102E;
            font-weight: 600;
            border: 1px solid #C8102E;
            padding: 0.2rem 0.55rem;
            border-radius: 2px;
            background: #FFF1F1;
          }

          /* Intro */
          .intro { margin-bottom: 2rem; }
          .intro h1 {
            font-size: 1.625rem;
            font-weight: 700;
            margin-bottom: 0.4rem;
            color: #1D2D50;
            line-height: 1.25;
          }
          .intro .lead {
            color: #475569;
            font-size: 0.9375rem;
          }

          /* Explainer */
          .explainer {
            background: white;
            border: 1px solid #e2e8f0;
            border-left: 3px solid #1D2D50;
            border-radius: 2px;
            padding: 1rem 1.25rem;
            margin: 1.5rem 0 2rem;
            transition: border-left-color 0.15s;
          }
          .explainer[open] { border-left-color: #C8102E; }
          .explainer summary {
            cursor: pointer;
            font-weight: 600;
            color: #1D2D50;
            list-style: none;
            user-select: none;
            font-size: 0.9375rem;
          }
          .explainer summary::-webkit-details-marker { display: none; }
          .explainer summary::before {
            content: "+";
            color: #C8102E;
            font-weight: 800;
            display: inline-block;
            width: 1.1em;
          }
          .explainer[open] summary::before { content: "−"; }
          .explainer-body {
            margin-top: 0.85rem;
            font-size: 0.9375rem;
            color: #334155;
          }
          .explainer-body p { margin-bottom: 0.75rem; }
          .explainer-body p:last-child { margin-bottom: 0; }

          .readers {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
          }
          .reader-btn {
            display: inline-block;
            padding: 0.45rem 0.95rem;
            background: #1D2D50;
            color: white;
            text-decoration: none;
            border-radius: 2px;
            font-size: 0.8125rem;
            font-weight: 600;
            letter-spacing: 0.01em;
            transition: background 0.15s;
          }
          .reader-btn:hover { background: #C8102E; }

          .copy-url {
            margin-top: 0.85rem;
            padding: 0.65rem 0.85rem;
            background: #F1F5F9;
            border: 1px solid #e2e8f0;
            border-radius: 2px;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 0.8125rem;
            color: #475569;
            word-break: break-all;
          }

          /* Items */
          .items-heading {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #1D2D50;
            margin-bottom: 0.75rem;
            padding-bottom: 0.6rem;
            border-bottom: 1px solid #e2e8f0;
          }

          .item {
            position: relative;
            padding: 1rem 0 1rem 1rem;
            border-bottom: 1px solid #e2e8f0;
            transition: padding-left 0.15s;
          }
          .item::before {
            content: "";
            position: absolute;
            left: 0;
            top: 1.15rem;
            bottom: 1.15rem;
            width: 2px;
            background: #1D2D50;
            opacity: 0.4;
            transition: background 0.15s, opacity 0.15s;
          }
          .item:hover::before { background: #C8102E; opacity: 1; }
          .item:last-child { border-bottom: none; }

          .item-meta {
            font-size: 0.6875rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            font-weight: 600;
            color: #1D2D50;
            margin-bottom: 0.4rem;
          }
          .item-title {
            font-size: 1.0625rem;
            font-weight: 600;
            line-height: 1.35;
          }
          .item-title a {
            color: #1D2D50;
            text-decoration: none;
          }
          .item-title a:hover {
            color: #C8102E;
            text-decoration: underline;
          }

          /* Footer */
          .footer {
            margin-top: 2.5rem;
            padding-top: 1.25rem;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 0.875rem;
            color: #64748b;
          }
          .footer a {
            color: #C8102E;
            text-decoration: none;
            font-weight: 600;
          }
          .footer a:hover { text-decoration: underline; }

          @media (max-width: 480px) {
            .brand-name { font-size: 1.125rem; }
            .intro h1 { font-size: 1.375rem; }
            .item-title { font-size: 1rem; }
          }
        </style>
      </head>
      <body>
        <div class="page">

          <header class="header">
            <span class="brand-name">Inside The Dugout</span>
            <span class="brand-tag">RSS Feed</span>
          </header>

          <section class="intro">
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p class="lead"><xsl:value-of select="/rss/channel/description"/></p>

            <details class="explainer">
              <summary>Was ist das hier?</summary>
              <div class="explainer-body">
                <p>
                  Du schaust gerade auf einen <strong>RSS-Feed</strong> — ein maschinenlesbares Format,
                  das von RSS-Readern abonniert wird. Anders als bei Social-Media-Algorithmen entscheidest
                  du selbst, was du wann liest.
                </p>
                <p>Kopiere die URL dieser Seite in deinen RSS-Reader, oder klicke direkt einen der hier an:</p>
                <div class="readers">
                  <a class="reader-btn" target="_blank" rel="noopener">
                    <xsl:attribute name="href">https://feedly.com/i/subscription/feed/<xsl:value-of select="/rss/channel/atom:link[@rel='self']/@href"/></xsl:attribute>
                    Feedly
                  </a>
                  <a class="reader-btn" target="_blank" rel="noopener">
                    <xsl:attribute name="href">https://www.inoreader.com/?add_feed=<xsl:value-of select="/rss/channel/atom:link[@rel='self']/@href"/></xsl:attribute>
                    Inoreader
                  </a>
                  <a class="reader-btn" target="_blank" rel="noopener">
                    <xsl:attribute name="href">https://theoldreader.com/feeds/subscribe?url=<xsl:value-of select="/rss/channel/atom:link[@rel='self']/@href"/></xsl:attribute>
                    The Old Reader
                  </a>
                  <a class="reader-btn" target="_blank" rel="noopener">
                    <xsl:attribute name="href">https://www.newsblur.com/?url=<xsl:value-of select="/rss/channel/atom:link[@rel='self']/@href"/></xsl:attribute>
                    NewsBlur
                  </a>
                </div>
                <div class="copy-url"><xsl:value-of select="/rss/channel/atom:link[@rel='self']/@href"/></div>
              </div>
            </details>
          </section>

          <main>
            <h2 class="items-heading">Aktuelle Einträge</h2>
            <xsl:for-each select="/rss/channel/item">
              <article class="item">
                <div class="item-meta">
                  <xsl:call-template name="format-date">
                    <xsl:with-param name="rfc822" select="pubDate"/>
                  </xsl:call-template>
                </div>
                <h3 class="item-title">
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                    <xsl:value-of select="normalize-space(title)"/>
                  </a>
                </h3>
              </article>
            </xsl:for-each>
          </main>

          <footer class="footer">
            <p>
              <a>
                <xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>
                ← Zurück zu Inside The Dugout
              </a>
            </p>
          </footer>

        </div>
      </body>
    </html>
  </xsl:template>

  <!-- Wandelt RFC-822 ("Mon, 11 May 2026 18:00:00 GMT") in "11 May 2026 · 18:00 UTC" um -->
  <xsl:template name="format-date">
    <xsl:param name="rfc822"/>
    <xsl:value-of select="substring($rfc822, 6, 2)"/>
    <xsl:text> </xsl:text>
    <xsl:value-of select="substring($rfc822, 9, 3)"/>
    <xsl:text> </xsl:text>
    <xsl:value-of select="substring($rfc822, 13, 4)"/>
    <xsl:text> · </xsl:text>
    <xsl:value-of select="substring($rfc822, 18, 5)"/>
    <xsl:text> UTC</xsl:text>
  </xsl:template>

</xsl:stylesheet>
