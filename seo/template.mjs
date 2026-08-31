import { analyticsHead, consentBanner, consentFooterLink, verificationMeta } from "./analytics.mjs";
import { nav, pageByPath, site } from "./content.mjs";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const absolute = (path) => new URL(path, site.origin).href;

const corners = '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>';

function schemaFor(page) {
  const canonical = absolute(page.path);
  const graph = [
    {
      "@type": "Organization",
      "@id": `${site.origin}/#organization`,
      name: site.name,
      url: site.origin,
      founder: { "@id": `${site.origin}/#person` },
      sameAs: [site.linkedin],
    },
    {
      "@type": "Person",
      "@id": `${site.origin}/#person`,
      name: site.author,
      url: absolute("/about/"),
      sameAs: [site.linkedin],
      jobTitle: "Independent automotive and autonomous mobility consultant",
      worksFor: { "@id": `${site.origin}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: page.title,
      description: page.description,
      inLanguage: site.language,
      isPartOf: { "@id": `${site.origin}/#website` },
      about: page.family === "institutional"
        ? { "@id": `${site.origin}/#person` }
        : { "@id": `${site.origin}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: breadcrumbsFor(page).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: absolute(item.path),
      })),
    },
  ];

  if (page.family === "service") {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: page.eyebrow,
      description: page.answer,
      url: canonical,
      provider: { "@id": `${site.origin}/#organization` },
      areaServed: "International",
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("</", "<\\/");
}

function breadcrumbsFor(page) {
  const crumbs = [{ path: "/", label: "Home" }];
  const [family] = page.path.split("/").filter(Boolean);
  const parents = {
    services: "Services",
    for: "Who I work with",
    industries: "Industries",
  };
  if (parents[family] && page.path !== `/${family}/`) {
    crumbs.push({ path: `/${family}/`, label: parents[family] });
  }
  crumbs.push({ path: page.path, label: page.eyebrow });
  return crumbs;
}

function header() {
  return `<a class="skip-link" href="#content">Skip to content</a>
<header class="site-header">
  <div class="site-header__inner">
    <a class="brand" href="/">Žilić&nbsp;Consult</a>
    <nav class="site-nav" aria-label="Primary">
      ${nav.map(([path, label]) => `<a href="${path}">${escapeHtml(label)}</a>`).join("")}
      <a href="mailto:${site.email}">Contact</a>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__cols footer-sitemap">
      <div>
        <p class="footer-brand">Žilić Consult</p>
        <p class="footer-tagline">Independent automotive, autonomous mobility and complex-product consulting.</p>
      </div>
      <div>
        <p class="footer-label">Explore</p>
        <a href="/services/">Services</a>
        <a href="/for/">Who I work with</a>
        <a href="/industries/">Industries</a>
      </div>
      <div>
        <p class="footer-label">Trust</p>
        <a href="/about/">About</a>
        <a href="/how-i-work/">How I work</a>
        <a href="/methodology/">Methodology</a>
        <a href="/sources/">Sources</a>
      </div>
      <div>
        <p class="footer-label">Contact</p>
        <a href="mailto:${site.email}">Email Tonći</a>
        <a href="${site.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      </div>
    </div>
    <div class="site-footer__legal">
      <span>© 2026 Žilić Consult</span>
      <a href="/privacy/">Privacy</a>
      <a href="/legal/">Legal</a>
      ${consentFooterLink}
    </div>
  </div>
</footer>`;
}

function breadcrumbs(page) {
  const items = breadcrumbsFor(page);
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>${items.map((item, index) => `<li>${index === items.length - 1 ? `<span aria-current="page">${escapeHtml(item.label)}</span>` : `<a href="${item.path}">${escapeHtml(item.label)}</a>`}</li>`).join("")}</ol>
  </nav>`;
}

function contactBand(page) {
  return `<section class="contact">
  <div class="contact__inner">
    <h2>Have a product, market or launch decision in front of you?</h2>
    <p class="contact__sub">Send me the situation, the decision and the timeline. I will tell you directly whether I can help and suggest the smallest useful engagement.</p>
    <div class="actions">
      <a class="btn blueprint btn--cta btn--inverse" href="mailto:${site.email}?subject=${encodeURIComponent(`20-minute fit call: ${page.eyebrow}`)}&body=Situation%3A%0A%0ADecision%3A%0A%0ATimeline%3A">Book a 20-minute fit call${corners}</a>
      <a class="link-underline--inverse" href="mailto:${site.email}?subject=${encodeURIComponent(`Consulting enquiry: ${page.eyebrow}`)}&body=Situation%3A%0A%0ADecision%3A%0A%0ATimeline%3A">Send me the problem</a>
    </div>
  </div>
</section>`;
}

function hubContent(page) {
  return `<section class="section page-section" aria-labelledby="page-list">
    <div class="section-head section-head--tight">
      <h2 id="page-list">Choose the problem you are solving</h2>
    </div>
    <div class="topic-grid">
      ${page.children.map((child) => `<article class="blueprint topic-card">
        <h3><a href="${child.path}">${escapeHtml(child.title)}</a></h3>
        <p>${escapeHtml(child.summary)}</p>
        <a class="topic-card__link" href="${child.path}" aria-label="Read more: ${escapeHtml(child.title)}">Fit, outputs and method →</a>
        ${corners}
      </article>`).join("")}
    </div>
  </section>`;
}

function detailContent(page) {
  const situationsTitle = page.family === "legal" ? "What this means" : "When this is useful";
  const deliverablesTitle = page.family === "legal" ? "Your options and responsibilities" : page.family === "trust" ? "What good provenance includes" : "Typical outputs";
  const related = (page.related || []).map((path) => pageByPath.get(path) || (path === "/" ? {
    path: "/",
    h1: "Product, market and growth consulting",
    answer: "Independent consulting for technology and mobility companies.",
  } : null)).filter(Boolean);

  return `${page.intro.map((paragraph) => `<p class="page-lede">${escapeHtml(paragraph)}</p>`).join("")}
  <section class="section page-section">
    <div class="split split--top">
      <div><h2>${escapeHtml(situationsTitle)}</h2></div>
      <ul class="rule-list detail-list">${page.situations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
  </section>
  <section class="section page-section">
    <div class="split split--top">
      <div><h2>${escapeHtml(deliverablesTitle)}</h2></div>
      <ul class="rule-list detail-list">${page.deliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
  </section>
  <section class="section page-section evidence-panel" aria-labelledby="method-heading">
    <p class="page-eyebrow">Method and limitations</p>
    <h2 id="method-heading">How the work is grounded</h2>
    <p>${escapeHtml(page.process)}</p>
    <p class="evidence-note">Material conclusions distinguish sourced facts, client evidence, observations, estimates and professional recommendations. See the <a href="/methodology/">methodology</a> and <a href="/sources/">source policy</a>.</p>
  </section>
  ${page.faqs?.length ? `<section class="section page-section" aria-labelledby="questions-heading">
    <div class="section-head section-head--tight"><h2 id="questions-heading">Common questions</h2></div>
    <div class="faq-list">${page.faqs.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div>
  </section>` : ""}
  ${related.length ? `<section class="section page-section" aria-labelledby="related-heading">
    <div class="section-head section-head--tight"><h2 id="related-heading">Related expertise</h2></div>
    <div class="related-grid">${related.map((item) => `<a href="${item.path}"><strong>${escapeHtml(item.eyebrow || item.h1)}</strong><span>${escapeHtml(item.answer)}</span></a>`).join("")}</div>
  </section>` : ""}`;
}

export function renderPage(page) {
  const canonical = absolute(page.path);
  return `<!DOCTYPE html>
<html lang="${site.language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  ${verificationMeta}
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:locale" content="en_GB">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${absolute(site.image)}">
  <meta property="og:image:alt" content="Tonći Žilić, independent product and mobility consultant">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="${absolute(site.image)}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/ds.css">
  <link rel="stylesheet" href="/assets/site.css">
  <script type="application/ld+json">${schemaFor(page)}</script>
  ${analyticsHead}
</head>
<body>
${header()}
<main id="content" class="shell page-shell">
  ${breadcrumbs(page)}
  <article>
    <header class="page-hero">
      <p class="hero__kicker">${escapeHtml(page.eyebrow)}</p>
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="answer-first">${escapeHtml(page.answer)}</p>
    </header>
    ${page.family === "hub" ? hubContent(page) : detailContent(page)}
  </article>
</main>
${contactBand(page)}
${footer()}
${consentBanner}
</body>
</html>
`;
}
