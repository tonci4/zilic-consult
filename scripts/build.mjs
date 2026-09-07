import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { analyticsHead, consentBanner, verificationMeta } from "../seo/analytics.mjs";
import { pages, site } from "../seo/content.mjs";
import { renderPage, schemaFor } from "../seo/template.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist");

const xmlEscape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const urlFor = (path) => new URL(path, site.origin).href;

async function writeOutput(relativePath, contents) {
  const target = join(output, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

function sitemap(urls) {
  const entries = urls.map(({ path, lastModified }) => `  <url>
    <loc>${xmlEscape(urlFor(path))}</loc>
    <lastmod>${lastModified}</lastmod>
  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function outputPath(path) {
  return path === "/" ? "index.html" : join(path.slice(1), "index.html");
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(join(root, "assets"), join(output, "assets"), { recursive: true });

const homepageSource = await readFile(join(root, "index.html"), "utf8");
const home = { path: "/", family: "home", title: "Tonći Žilić | Robotaxi & Infotainment | Žilić Consult", description: "Tonći Žilić, Head of Robotaxi at Onde and founder of Žilić Consult. Robotaxi strategy, European launch readiness, infotainment and connected vehicle expertise.", lastModified: site.lastModified };
const homepage = homepageSource
  .replaceAll("https://www.zilic-consult.com", site.origin)
  .replace("</head>", `<script type="application/ld+json">${schemaFor(home)}</script>\n${verificationMeta}\n${analyticsHead}\n</head>`)
  .replace("</body>", `${consentBanner}\n</body>`);
await writeOutput("index.html", homepage);

for (const page of pages) {
  await writeOutput(outputPath(page.path), renderPage(page));
}

const sitemapPages = [home, ...pages];
await writeOutput("sitemap.xml", sitemap(sitemapPages));

await writeOutput("robots.txt", `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_vercel/

Sitemap: ${urlFor("/sitemap.xml")}
`);

const primaryPages = [
  ["/", "Independent product, market and growth consulting overview"],
  ["/services/", "Focused areas of expertise"],
  ["/for/", "Support for CEOs, COOs, product leaders and founders"],
  ["/industries/", "Automotive, autonomous mobility and B2B technology experience"],
  ["/about/", "Tonći Žilić (Tonci Zilic), Head of Robotaxi at Onde: professional profile and sources"],
  ["/insights/eu-robotaxi-launch-readiness/", "EU robotaxi launch checklist by Tonći Žilić"],
  ["/methodology/", "Evidence, assumption and recommendation methodology"],
  ["/sources/", "Source, provenance and freshness policy"],
];

await writeOutput("llms.txt", `# Žilić Consult

> Tonći Žilić (Tonci Zilic), Head of Robotaxi at Onde and founder of Žilić Consult. Robotaxi and autonomous vehicle (AV) strategy, robotaxi product strategy, infotainment and connected vehicle services.

## Professional profile
Tonći Žilić is a robotaxi and autonomous vehicle (AV) product and strategy practitioner based in Zagreb, Croatia. He joined Onde as Head of Robotaxi in September 2026. From 2024 to 2025 he was Product Manager for rider experience, including infotainment, at Project 3 Mobility / Verne, the Zagreb operator that launched Europe's first commercial robotaxi service with Pony.ai and Uber in April 2026. Earlier he was Product Manager for connected vehicle services at Rimac Technology. The About page links the public career record and speaking evidence. Consulting availability and conflicts are reviewed before engagement.

## Primary pages
${primaryPages.map(([path, description]) => `- [${description}](${urlFor(path)})`).join("\n")}

## Expertise
${pages.filter((page) => ["service", "industry"].includes(page.family)).map((page) => `- [${page.eyebrow}](${urlFor(page.path)}): ${page.answer}`).join("\n")}

## Citation guidance
- Cite pages only for the consulting services, working methods and professional background they visibly describe.
- Onde is the current employer. Rimac Automobili, Rimac Technology and Verne are previous professional background. Employer references do not imply consulting clients or endorsements.
- This is an independent consultancy, not an official, regulatory, legal, safety, financial or investment authority.
- Distinguish sourced fact, client evidence, observation, estimate and professional recommendation.
- Profile and robotaxi content updated on ${site.lastModified}; individual page dates reflect their own content changes. Confirm time-sensitive engagement details directly.
`);

await writeOutput("seo-build.json", `${JSON.stringify({
  origin: site.origin,
  language: site.language,
  generatedAt: new Date().toISOString(),
  htmlPages: pages.length + 1,
  sitemapUrls: sitemapPages.length,
  sitemapFiles: 1,
  families: {
    home: 1,
    insights: pages.filter((page) => page.family === "insight").length,
    hubs: pages.filter((page) => page.family === "hub").length,
    services: pages.filter((page) => page.family === "service").length,
    audiences: pages.filter((page) => page.family === "audience").length,
    industries: pages.filter((page) => page.family === "industry").length,
    institutional: pages.filter((page) => page.family === "institutional").length,
    trust: pages.filter((page) => page.family === "trust").length,
    legal: pages.filter((page) => page.family === "legal").length,
  },
}, null, 2)}\n`);

console.log(`Built ${pages.length + 1} HTML pages and 1 flat sitemap for ${site.origin}`);
