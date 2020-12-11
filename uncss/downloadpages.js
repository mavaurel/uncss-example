const request = require('request');
const path = require('path');
const fs = require('fs');
const URL = require('url');

const htmlOutputDir = path.join(process.cwd(), './uncss/saved_html');
const urls = JSON.parse(fs.readFileSync(path.join(process.cwd(), './uncss/siteUrls.json')));


const downloadPage = (url) => new Promise((resolve, reject) => {
  console.log(`Downloading ${url}`);
  request(url, (err, res, body) => {
    if (err) {
      return reject(err);
    }
    return resolve(body);
  });
});

const savePageData = (url, data) => new Promise((resolve, reject) => {
  const { pathname } = URL.parse(url);
  const filePath = path.join(htmlOutputDir, `${pathname.replace(/\//g,'__')}.html`);

  console.log(`Saving as ${filePath}`);

  fs.writeFile(filePath, data, (err, res) => {
    if (err) {
      return reject(err);
    }
    return resolve();
  });
});


(async () => {
  console.log(urls);
  for (const url of urls) {
    const data = await downloadPage(url);
    await savePageData(url, data);
  }
})();
