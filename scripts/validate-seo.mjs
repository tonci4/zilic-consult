import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { pages, site } from "../seo/content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist");
const errors = [];
const warnings = [];

const fail = (file, message) => errors.push(`${file}: ${message}`);
const warn = (file, message) => warnings.push(`${file}: ${message}`);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await walk(path));
    else results.push(path);
  }
  return results;
}

const allFiles = await walk(output);
const htmlFiles = allFiles.filter((path) => path.endsWith(".html"));
const relativeFiles = new Set(allFiles.map((path) => `/${relative(output, path).split(sep).join("/")}`));
const pageUrlToFile = new Map();
for (const file of htmlFiles) {
  const rel = relative(output, file).split(sep).join("/");
  const path = rel === "index.html" ? "/" : `/${rel.replace(/index\.html$/, "")}`;
  pageUrlToFile.set(path, file);
}

const expectedPaths = new Set(["/", ...pages.map((page) => page.path)]);
if (htmlFiles.length !== expectedPaths.size) {
  fail("dist", `expected ${expectedPaths.size} HTML pages, found ${htmlFiles.length}`);
}
for (const path of expectedPaths) {
  if (!pageUrlToFile.has(path)) fail("dist", `missing expected page ${path}`);
}
for (const path of pageUrlToFile.keys()) {
  if (!expectedPaths.has(path)) fail("dist", `unexpected generated page ${path}`);
}

const values = {
  titles: new Map(),
  h1s: new Map(),
  canonicals: new Map(),
};
const incoming = new Map([...expectedPaths].map((path) => [path, 0]));

const recordUnique = (kind, value, file) => {
  if (!value) return;
  if (values[kind].has(value)) {
    fail(file, `duplicate ${kind.slice(0, -1)} also used by ${values[kind].get(value)}`);
  } else {
    values[kind].set(value, file);
  }
};

const one = (html, regex) => html.match(regex)?.[1]?.trim() || "";
const all = (html, regex) => [...html.matchAll(regex)].map((match) => match[1]);
const stripTags = (html) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

for (const file of htmlFiles) {
  const rel = relative(output, file).split(sep).join("/");
  const pagePath = [...pageUrlToFile.entries()].find(([, value]) => value === file)?.[0];
  const html = await readFile(file, "utf8");

  if (!/^<!DOCTYPE html>/i.test(html)) fail(rel, "missing HTML5 doctype");
  if (one(html, /<html[^>]*\blang="([^"]+)"/i) !== site.language) fail(rel, `html lang must be "${site.language}"`);
  if (/\b(undefined|null)\b/i.test(html)) fail(rel, "contains accidental undefined or null output");

  const titles = all(html, /<title>([\s\S]*?)<\/title>/gi).map(stripTags);
  if (titles.length !== 1) fail(rel, `expected one title, found ${titles.length}`);
  else {
    if (titles[0].length < 30 || titles[0].length > 65) warn(rel, `title length is ${titles[0].length}; target 30–65`);
    recordUnique("titles", titles[0], rel);
  }

  const descriptions = all(html, /<meta\s+name="description"\s+content="([^"]*)"/gi);
  if (descriptions.length !== 1) fail(rel, `expected one meta description, found ${descriptions.length}`);
  else if (descriptions[0].length < 110 || descriptions[0].length > 170) {
    fail(rel, `meta description length is ${descriptions[0].length}; required 110–170`);
  }

  const h1s = all(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map(stripTags);
  if (h1s.length !== 1) fail(rel, `expected one H1, found ${h1s.length}`);
  else recordUnique("h1s", h1s[0], rel);

  const canonicals = all(html, /<link\s+rel="canonical"\s+href="([^"]+)"/gi);
  if (canonicals.length !== 1) fail(rel, `expected one canonical, found ${canonicals.length}`);
  else {
    let canonical;
    try {
      canonical = new URL(canonicals[0]);
      if (canonical.origin !== site.origin) fail(rel, `canonical is outside approved origin: ${canonical.origin}`);
      if (canonical.pathname !== pagePath) fail(rel, `canonical path ${canonical.pathname} does not match ${pagePath}`);
    } catch {
      fail(rel, `malformed canonical: ${canonicals[0]}`);
    }
    recordUnique("canonicals", canonicals[0], rel);
  }

  if (!/<meta\s+name="robots"\s+content="[^"]*index[^"]*follow/i.test(html)) fail(rel, "missing index,follow robots directive");
  for (const property of ["og:title", "og:description", "og:url", "og:image"]) {
    if (!new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]+"`, "i").test(html)) fail(rel, `missing ${property}`);
  }
  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    if (!new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]+"`, "i").test(html)) fail(rel, `missing ${name}`);
  }

  const alternates = new Map(all(html, /<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi).map((match) => {
    const full = html.match(new RegExp(`<link\\s+rel="alternate"\\s+hreflang="${match}"\\s+href="([^"]+)"`, "i"));
    return [match, full?.[1] || ""];
  }));
  if (alternates.get("en") !== canonicals[0]) fail(rel, "English hreflang must match self-canonical");
  if (alternates.get("x-default") !== canonicals[0]) fail(rel, "x-default must match self-canonical");

  const jsonLdBlocks = all(html, /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  if (!jsonLdBlocks.length) fail(rel, "missing JSON-LD");
  for (const block of jsonLdBlocks) {
    try {
      const parsed = JSON.parse(block);
      if (parsed["@context"] !== "https://schema.org") fail(rel, "JSON-LD must use schema.org context");
    } catch (error) {
      fail(rel, `invalid JSON-LD: ${error.message}`);
    }
  }

  const hrefs = all(html, /<a\b[^>]*\bhref="([^"]+)"/gi);
  for (const href of hrefs) {
    if (/^(mailto:|tel:|https?:\/\/|#)/i.test(href)) continue;
    let target;
    try {
      const resolved = new URL(href, `${site.origin}${pagePath}`);
      if (resolved.origin !== site.origin) continue;
      target = resolved.pathname;
    } catch {
      fail(rel, `malformed internal link ${href}`);
      continue;
    }
    const targetFile = target.endsWith("/") ? `${target}index.html` : target;
    if (!relativeFiles.has(targetFile)) fail(rel, `broken internal link ${href}`);
    if (incoming.has(target)) incoming.set(target, incoming.get(target) + 1);
  }
}

for (const [path, count] of incoming) {
  if (path !== "/" && count === 0) fail("internal links", `${path} has no crawlable incoming link`);
}

const sitemapFiles = allFiles.filter((path) => /\/sitemap(?:-[^/]+)?\.xml$/.test(path));
if (sitemapFiles.length !== 1) fail("sitemaps", `expected one flat sitemap, found ${sitemapFiles.length}`);
const sitemapXml = await readFile(join(output, "sitemap.xml"), "utf8");
if (!/<urlset\b/.test(sitemapXml) || /<sitemapindex\b/.test(sitemapXml)) {
  fail("sitemap.xml", "must be a flat urlset, not a sitemap index");
}
const sitemapUrls = all(sitemapXml, /<loc>([^<]+)<\/loc>/g);
const sitemapSet = new Set(sitemapUrls);
if (sitemapUrls.length !== sitemapSet.size) fail("sitemaps", "duplicate sitemap URL");
const expectedUrls = new Set([...expectedPaths].map((path) => new URL(path, site.origin).href));
for (const url of expectedUrls) if (!sitemapSet.has(url)) fail("sitemaps", `missing ${url}`);
for (const url of sitemapSet) if (!expectedUrls.has(url)) fail("sitemaps", `unexpected ${url}`);

const robots = await readFile(join(output, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${site.origin}/sitemap.xml`)) fail("robots.txt", "missing canonical flat sitemap URL");
if (!robots.includes("Disallow: /api/")) fail("robots.txt", "internal API route is not blocked");

const manifest = JSON.parse(await readFile(join(output, "seo-build.json"), "utf8"));
if (manifest.htmlPages !== htmlFiles.length) fail("seo-build.json", "HTML page count does not match output");
if (manifest.sitemapUrls !== sitemapUrls.length) fail("seo-build.json", "sitemap URL count does not match output");

if (warnings.length) {
  console.log(`SEO warnings (${warnings.length}):`);
  warnings.forEach((message) => console.log(`- ${message}`));
}
if (errors.length) {
  console.error(`SEO validation failed with ${errors.length} error(s):`);
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`SEO validation passed: ${htmlFiles.length} HTML pages, ${sitemapUrls.length} sitemap URLs, 1 flat sitemap, 0 errors.`);
