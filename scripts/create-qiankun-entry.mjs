import fs from "node:fs"
import path from "node:path"

const outDir = path.resolve("out")
const appHtmlPath = path.join(outDir, "apps", "elog.html")
const entryPath = path.join(outDir, "qiankun-entry.html")
const sourceHtml = fs.readFileSync(appHtmlPath, "utf8")
const stylesheetLinks = Array.from(sourceHtml.matchAll(/<link rel="stylesheet"[^>]+>/g)).map((match) => match[0])
const fontPreloads = Array.from(sourceHtml.matchAll(/<link rel="preload"[^>]+as="font"[^>]+>/g)).map((match) => match[0])

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>eLog Qiankun Entry</title>
    ${fontPreloads.join("\n    ")}
    ${stylesheetLinks.join("\n    ")}
  </head>
  <body>
    <div id="elog-qiankun-root"></div>
    <script src="/qiankun-react-vendor.js"></script>
    <script src="/qiankun-lifecycle.js"></script>
  </body>
</html>
`

fs.writeFileSync(entryPath, html)
console.info(`[eLog] wrote ${path.relative(process.cwd(), entryPath)}`)
