const sitemaps = require("sitemap-stream-parser");
const fs = require("fs");
const path = require("path");

// const sitemapUrl = [process.argv[2]];
const sitemapUrl = ['https://www.proveedores.com/sitemap.xml']; 
const all_urls = [];
const filePath = path.join(process.cwd(), "/uncss/siteUrls.json");

sitemaps.parseSitemaps(
  sitemapUrl,
  function(url) {
    all_urls.push(url);
  },
  function(err, sitemaps) {
    fs.writeFileSync(filePath, JSON.stringify(all_urls, null, 4));
  }
);