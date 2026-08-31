# Žilić Consult SEO, GEO and AIEO architecture

## Governing decisions

- Canonical production origin: `https://www.zilic-consult.com`
- Rendering: fully static HTML; no visitor-facing content depends on JavaScript.
- Language: English only. Additional languages must be released as complete, reciprocal clusters rather than partial navigation translations.
- Content rule: one durable page per legitimate intent. Minor keyword modifiers do not receive separate pages.
- Claim rule: previous employers are professional background, not consulting clients or endorsements.
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
| Trust and identity | consultant background | `/about/` | Rimac, Verne, founder, product leadership |
| Engagement intent | consulting process and formats | `/how-i-work/` | sprint, project, workshop, retainer, interim |
| Method and trust | evidence and reliability | `/methodology/` | fact, observation, estimate, assumption, recommendation |
| Provenance | source policy | `/sources/` | authority, retrieval date, limitations, confidentiality |

Search language should be revalidated with Search Console query data after indexing. No search-volume figures are asserted without a named external dataset.

## 2. Canonical URL architecture

```text
/
├── services/
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
