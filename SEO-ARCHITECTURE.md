# Žilić Consult SEO, GEO and AIEO architecture

## Governing decisions

- Canonical production origin: `https://www.zilic-consult.com`
- Rendering: fully static HTML; no visitor-facing content depends on JavaScript.
- Language: English only. Additional languages must be released as complete, reciprocal clusters rather than partial navigation translations.
- Content rule: one durable page per legitimate intent. Minor keyword modifiers do not receive separate pages.
- Claim rule: previous employers are professional background, not consulting clients or endorsements.
- Scope rule: relevance is built through the verified profile, sourced public facts and insights that carry the personal-view disclaimer. New engagement formats or method descriptions are not added without the owner's review.
- Ranking rule: the implementation improves eligibility, clarity and crawlability; it does not claim or guarantee first position.

## 1. Intent and keyword-cluster map

| Cluster | Primary intent | Canonical page | Supporting concepts |
| --- | --- | --- | --- |
| Consultancy overview | independent product, market and growth consultant | `/` | complex products, product strategy, pricing, funding, growth |
| Service directory | product, market and growth consulting services | `/services/` | strategy, readiness, entry, pricing, funding, leadership |
| Product strategy | product strategy consultant | `/services/product-mobility-strategy/` | roadmaps, requirements, service design, mobility product |
| Market readiness | market readiness consultant | `/services/market-readiness/` | validation, segmentation, positioning, buying process |
| Market entry | market entry consultant | `/services/market-entry-launch/` | geographic expansion, launch, partnerships, operations |
| Enterprise pricing | B2B pricing consultant | `/services/b2b-enterprise-pricing/` | packaging, value metric, commercial model, governance |
| Fundraising | pre-seed and seed fundraising advisor | `/services/startup-fundraising/` | investor narrative, pitch deck, data room |
| Robotaxi service | robotaxi and autonomous mobility consultant | `/services/robotaxi-autonomous-mobility/` | rider experience, fleet operations, launch readiness |
| Interim leadership | interim product leader | `/services/interim-product-leadership/` | fractional leadership, transition, transformation |
| Executive advisory | executive advisor and strategy workshops | `/services/executive-advisory-workshops/` | decision support, vendor review, facilitation |
| Leadership audiences | advisor by accountable role | `/for/` | CEO, COO, product leader, founder |
| CEO | B2B CEO advisor | `/for/ceos/` | strategy, pricing, funding, executive decisions |
| COO | COO advisor | `/for/coos/` | operating model, readiness, launch, scale |
| Product leader | product leadership advisor | `/for/product-leaders/` | roadmap, requirements, cross-functional product |
| Founder | B2B startup advisor | `/for/founders/` | focus, validation, pricing, fundraising |
| Sector directory | industry expertise | `/industries/` | automotive, autonomous mobility, B2B technology |
| Automotive | automotive product consultant | `/industries/automotive/` | connected vehicles, automotive-grade programmes |
| Autonomous mobility | autonomous mobility advisor | `/industries/autonomous-mobility/` | robotaxi, fleet, service, city launch |
| B2B technology | B2B technology consultant | `/industries/technology-b2b/` | complex products, enterprise offers, growth |
| Trust and identity | Tonći Žilić / Tonci Zilic, robotaxi and AV strategy | `/about/` | Head of Robotaxi at Onde, Verne pre-launch rider experience, Rimac, areas of expertise, dated track record |
| Infotainment | infotainment and connected vehicle consultant | `/services/infotainment-connected-vehicle/` | IVI, automotive HMI, passenger experience, apps, cloud, OTA |
| EU robotaxi planning | European robotaxi launch readiness | `/insights/eu-robotaxi-launch-readiness/` | operating domain, passenger journey, fleet, local readiness |
| Engagement intent | consulting process and formats | `/how-i-work/` | sprint, project, workshop, retainer, interim |
| Method and trust | evidence and reliability | `/methodology/` | fact, observation, estimate, assumption, recommendation |
| Provenance | source policy | `/sources/` | authority, retrieval date, limitations, confidentiality |

Search language should be revalidated with Search Console query data after indexing. No search-volume figures are asserted without a named external dataset.

## 2. Canonical URL architecture

```text
/
├── services/
│   ├── infotainment-connected-vehicle/
│   ├── product-mobility-strategy/
│   ├── market-readiness/
│   ├── market-entry-launch/
│   ├── b2b-enterprise-pricing/
│   ├── startup-fundraising/
│   ├── robotaxi-autonomous-mobility/
│   ├── interim-product-leadership/
│   └── executive-advisory-workshops/
├── for/
│   ├── ceos/
│   ├── coos/
│   ├── product-leaders/
│   └── founders/
├── industries/
│   ├── automotive/
│   ├── autonomous-mobility/
│   └── technology-b2b/
├── insights/
│   └── eu-robotaxi-launch-readiness/
├── about/
├── how-i-work/
├── methodology/
├── sources/
├── privacy/
└── legal/
```

## 3. Entity and language data model

`seo/content.mjs` is the source of truth. Every page record contains:

- `path`, `family`, `title`, `description`, `eyebrow`, `h1`
- answer-first summary and unique introduction
- situations, deliverables, method/limitation language and FAQs
- related canonical entities for internal linking
- a meaningful `lastModified` date

The equivalent “entities” for this consultancy are supported services, leadership audiences and sectors—not generated locations. A new record is allowed only when unique expertise, use cases, outputs and limitations can be written.

Current language model:

```text
language: en
canonical: self
hreflang: en + x-default
```

Future language records must include a localized path, complete visitor-facing copy, a self-canonical, reciprocal links to every equivalent and `x-default`. IP or browser-language redirects are prohibited.

## 4–6. Templates, generation and structured data

- `seo/template.mjs`: reusable static HTML page, hub, breadcrumb, trust, FAQ, related-topic and contact templates.
- `scripts/build.mjs`: creates `dist/`, copies assets, renders every page, and generates discovery files from the same records.
- Structured data: truthful `Organization`, `Person`, `WebSite`/`WebPage`, `BreadcrumbList` and `Service` entities. No ratings, reviews, invented dates, clients or official status.
- Every page includes a unique title, description, H1, self-canonical, robots directive, Open Graph, Twitter metadata, share image, language metadata and JSON-LD.

## 7. Internal-linking rules

1. The homepage links to the expertise hub and priority engagements; the global footer links to all three family hubs.
2. Each hub links to every child with ordinary HTML anchors.
3. Each detail page links to relevant services, audiences, sectors, methodology and sources.
4. Breadcrumbs link to home and the parent hub.
5. The global footer links to the principal hubs, trust pages and legal pages.
6. The validator fails if any generated page has no crawlable incoming link or a link target is missing.

## 8. Robots, sitemap and AI discovery

The build emits:

- `/robots.txt`
- `/sitemap.xml` (one flat sitemap containing every canonical page)
- `/llms.txt`

`lastmod` changes only with a material content change. `llms.txt` is a citation and discovery aid, not a ranking claim.

## 9. Automated validation

Run:

```bash
npm run check
```

`scripts/validate-seo.mjs` fails on missing/duplicate metadata, duplicate H1s or canonicals, malformed JSON-LD, invalid canonical origins, broken internal links, orphan pages, incomplete English hreflang, sitemap omissions/duplicates, accidental null output, wrong page counts and meta descriptions outside 110–170 characters.

## 10. Operations and Search Console handoff

1. Keep `SITE_ORIGIN` equal to the final public canonical host during the build. If a custom domain is introduced, update the production environment and redirect the old origin permanently.
2. Deploy the generated `dist/` directory.
3. Verify representative pages from each family return complete HTML with a `200` response.
4. Add the exact property for the canonical host in Google Search Console.
5. Submit `https://www.zilic-consult.com/sitemap.xml`.
6. Inspect `/`, one service, one audience, one industry and `/methodology/`.
7. Monitor indexing, queries, page coverage, Core Web Vitals, structured-data reports and manual actions.
8. Use real Search Console queries to refine copy and identify genuinely missing intent—not to generate keyword permutations.
9. Regenerate after content changes with `npm run check`; sitemap dates come from the edited page records.

The generated `dist/seo-build.json` records exact page, family, sitemap and URL counts for each build.

## 7 September 2026 update

- The public LinkedIn career record was checked on 7 September 2026 and already listed Head of Robotaxi at Onde, September 2026–present.
- Added a substantive infotainment service page and European robotaxi launch guide; 27 pages total, 9 services and 1 insight.
- The homepage, About page, robotaxi service and autonomous mobility page connect the verified current role with previous Rimac and Project 3 Mobility / Verne experience.
- Shared Person, employer Organization and WebSite entities are generated from one source, including the homepage. The personal LinkedIn profile belongs only to Person.sameAs.
- About uses ProfilePage.mainEntity; the guide uses Article with visible author, dates and source links.
- JSON-LD validation now checks identity, employment, local entity references, profile/article requirements and breadcrumb completeness.
- The wildcard robots policy already permits search crawlers. No hidden keyword blocks, crawler-specific content, ranking instructions or meta keywords were added. llms.txt remains an optional discovery summary.
- Google Analytics and Search Console property settings were preserved. Operational reports are excluded from deployment by .vercelignore.

## 8 September 2026 draft — pending owner review, not deployed

Goal: be findable by search engines and AI assistants for European robotaxi and autonomous vehicle strategy queries. Targets, query map and measurement are kept in a local working file that is not tracked in this repository.

- Scope rule added above. No new service pages were added and no engagement method is described; the change is confined to the profile, one homepage sentence and shared entity data.
- About rewritten as a factual expert profile: title and H1 carry "robotaxi and AV strategy"; new "Areas of expertise" and dated "Robotaxi and autonomous mobility track record" sections; one new FAQ on robotaxi and AV experience; Pony.ai launch release added as context, with a note that the owner's Verne role ended before the launch. All facts remain those verified against the LinkedIn record on 7 September 2026.
- Homepage: one added sentence in the autonomous-mobility proof card about Verne's April 2026 launch. Hero, engagements table, navigation, layout and H1 unchanged.
- The About summary sentence is reused by the "Related expertise" card on nine pages that link to About; those cards change with it.
- Shared data: Person description, `knowsAbout` and `homeLocation` (Zagreb, HR); llms.txt summary and profile paragraph. Template records now support section `items` lists and per-page Service `areaServed` and `serviceType`.
- `lastModified` bumped to 2026-09-08 for the homepage and About only. 27 pages, unchanged count.
