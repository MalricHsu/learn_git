// Regenerates public/sitemap.xml from the router's real paths.
// Run: npm run sitemap    (SITE_URL=https://your-domain npm run sitemap)
import { writeFileSync } from "node:fs";
import { allPaths, SITE_URL } from "../src/seo.js";

const origin = (process.env.SITE_URL || SITE_URL).replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const body = allPaths()
  .map((path) => `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${today}</lastmod>
  </url>`)
  .join("\n");

writeFileSync(
  new URL("../public/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`,
);
console.log(`sitemap.xml — ${allPaths().length} URLs at ${origin}`);
