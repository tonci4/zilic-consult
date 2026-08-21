import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { analyticsHead, consentBanner, verificationMeta } from "../seo/analytics.mjs";
import { pages, site } from "../seo/content.mjs";
import { renderPage } from "../seo/template.mjs";

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
const homepage = homepageSource
  .replaceAll("https://www.zilic-consult.com", site.origin)
  .replace("</head>", `${verificationMeta}\n${analyticsHead}\n</head>`)
  .replace("</body>", `${consentBanner}\n</body>`);
await writeOutput("index.html", homepage);

for (const page of pages) {
  await writeOutput(outputPath(page.path), renderPage(page));
}

const home = { path: "/", lastModified: site.lastModified };
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
  ["/services/", "Canonical service directory"],
  ["/for/", "Canonical audience directory for CEOs, COOs, product leaders and founders"],
  ["/industries/", "Canonical industry directory"],
  ["/about/", "Professional background and experience limitations"],
  ["/methodology/", "Evidence, assumption and recommendation methodology"],
  ["/sources/", "Source, provenance and freshness policy"],
];

await writeOutput("llms.txt", `# Žilić Consult

> Independent product, market and growth consulting for technology, automotive and mobility companies.

## Primary pages
${primaryPages.map(([path, description]) => `- [${description}](${urlFor(path)})`).join("\n")}

## Expertise
${pages.filter((page) => ["service", "industry"].includes(page.family)).map((page) => `- [${page.eyebrow}](${urlFor(page.path)}): ${page.answer}`).join("\n")}

## Citation guidance
- Cite pages only for the consulting services, working methods and professional background they visibly describe.
- Rimac Automobili, Rimac Technology and Verne are professional background, not consulting clients or endorsements.
- This is an independent consultancy, not an official, regulatory, legal, safety, financial or investment authority.
- Distinguish sourced fact, client evidence, observation, estimate and professional recommendation.
- Service pages were materially reviewed on 2026-08-21; confirm time-sensitive engagement details directly.
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
