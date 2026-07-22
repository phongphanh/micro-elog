import fs from "node:fs"
import path from "node:path"

const outDir = path.resolve("out")
const appHtmlPath = path.join(outDir, "apps", "elog.html")
const entryPath = path.join(outDir, "qiankun-entry")
const stableCssPath = path.join(outDir, "qiankun.css")
const lifecyclePath = path.join(outDir, "qiankun-lifecycle.js")
const sourceHtml = fs.readFileSync(appHtmlPath, "utf8")
const stylesheetHrefs = Array.from(sourceHtml.matchAll(/<link rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g)).map(
  (match) => match[1],
)
const fontPreloads = Array.from(sourceHtml.matchAll(/<link rel="preload"[^>]+as="font"[^>]+>/g)).map((match) => match[0])

const stableCss = stylesheetHrefs
  .map((href) => fs.readFileSync(path.join(outDir, href.replace(/^\//, "")), "utf8"))
  .join("\n")

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>eLog Qiankun Entry</title>
    ${fontPreloads.join("\n    ")}
    <link rel="stylesheet" href="/qiankun.css" />
  </head>
  <body>
    <div id="elog-qiankun-root"></div>
    <script src="/qiankun-lifecycle.js"></script>
  </body>
</html>
`

const lifecycle = `;(function () {
  var appCode = "elog"
  var defaultAssetBaseUrl = "https://micro-elog.pages.dev"
  var loadingPromise = null

  function normalizeBaseUrl(props) {
    var baseUrl =
      (props && props.assetBaseUrl) ||
      window.__ELOG_ASSET_BASE_URL__ ||
      window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ ||
      defaultAssetBaseUrl

    return String(baseUrl).replace(/\\/$/, "")
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-elog-qiankun-src="' + src + '"]')

      if (existing) {
        if (existing.dataset.loaded === "true") {
          resolve()
          return
        }

        existing.addEventListener("load", function () { resolve() }, { once: true })
        existing.addEventListener("error", reject, { once: true })
        return
      }

      var script = document.createElement("script")
      script.src = src
      script.async = false
      script.dataset.elogQiankunSrc = src
      script.onload = function () {
        script.dataset.loaded = "true"
        resolve()
      }
      script.onerror = function () {
        reject(new Error("[eLog] failed to load " + src))
      }
      document.head.appendChild(script)
    })
  }

  function ensureApp(props) {
    if (window.elogApp && window.elogApp.__runtime === "react") {
      return Promise.resolve(window.elogApp)
    }

    if (!loadingPromise) {
      var baseUrl = normalizeBaseUrl(props)
      loadingPromise = Promise.resolve()
        .then(function () {
          if (window.React && window.ReactDOMClient && window.ReactJSXRuntime) return
          return loadScript(baseUrl + "/qiankun-react-vendor.js")
        })
        .then(function () {
          return loadScript(baseUrl + "/qiankun-app.js")
        })
        .then(function () {
          if (!window.elogApp || window.elogApp.__runtime !== "react") {
            throw new Error("[eLog] Qiankun app runtime was not registered")
          }

          return window.elogApp
        })
    }

    return loadingPromise
  }

  function publishNav(props) {
    if (!props || !props.shellBridge || typeof props.shellBridge.setNavItems !== "function") return

    props.shellBridge.setNavItems(appCode, [
      { key: "dashboard", label: "Dashboard", path: "/apps/elog", icon: "LayoutDashboard" },
      { key: "bookings", label: "Booking Management", path: "/apps/elog/bookings", icon: "ClipboardList" },
      { key: "shipments", label: "Shipment Management", path: "/apps/elog/shipments", icon: "Ship" },
      { key: "containers", label: "Container Tracking", path: "/apps/elog/containers", icon: "Container" },
      { key: "appointments", label: "Truck Appointment", path: "/apps/elog/appointments", icon: "CalendarDays" },
      { key: "vehicles", label: "Vehicle Management", path: "/apps/elog/vehicles", icon: "Truck" },
      { key: "drivers", label: "Driver Management", path: "/apps/elog/drivers", icon: "Users" },
      { key: "documents", label: "Document Center", path: "/apps/elog/documents", icon: "FileText" },
      { key: "invoices", label: "Billing & Invoices", path: "/apps/elog/invoices", icon: "CircleDollarSign" },
      { key: "payments", label: "Payments", path: "/apps/elog/payments", icon: "CreditCard" },
      { key: "customers", label: "Customer Management", path: "/apps/elog/customers", icon: "Building2" },
      { key: "partners", label: "Partner Management", path: "/apps/elog/partners", icon: "Earth" },
      { key: "reports", label: "Reports", path: "/apps/elog/reports", icon: "Gauge" },
      { key: "notifications", label: "Notification Center", path: "/apps/elog/notifications", icon: "Bell" },
      { key: "users", label: "User Management", path: "/apps/elog/users", icon: "Users" },
      { key: "roles", label: "Role Management", path: "/apps/elog/roles", icon: "Shield" },
      { key: "master-data", label: "Master Data", path: "/apps/elog/master-data", icon: "Database" },
      { key: "settings", label: "System Settings", path: "/apps/elog/settings", icon: "Settings" }
    ])
  }

  function clearNav(props) {
    if (!props || !props.shellBridge || typeof props.shellBridge.clearNavItems !== "function") return
    props.shellBridge.clearNavItems(appCode)
  }

  function bootstrap(props) {
    publishNav(props)
    return ensureApp(props).then(function (app) {
      return app.bootstrap ? app.bootstrap(props) : undefined
    })
  }

  function mount(props) {
    publishNav(props)
    return ensureApp(props).then(function (app) {
      return app.mount(props)
    })
  }

  function unmount(props) {
    var app = window.elogApp
    clearNav(props)
    loadingPromise = null

    if (app && app.__runtime === "react" && typeof app.unmount === "function") {
      return Promise.resolve(app.unmount(props)).then(function () {
        clearNav(props)
      })
    }

    return Promise.resolve()
  }

  var lifecycle = {
    __runtime: "loader",
    bootstrap: bootstrap,
    mount: mount,
    unmount: unmount
  }

  window.bootstrap = bootstrap
  window.mount = mount
  window.unmount = unmount
  window.elogQiankunLoader = lifecycle
})()
`

fs.rmSync(entryPath, { recursive: true, force: true })
fs.writeFileSync(stableCssPath, stableCss)
fs.writeFileSync(lifecyclePath, lifecycle)
fs.writeFileSync(entryPath, html)
console.info(`[eLog] wrote ${path.relative(process.cwd(), entryPath)}`)
console.info(`[eLog] wrote ${path.relative(process.cwd(), stableCssPath)}`)
console.info(`[eLog] wrote ${path.relative(process.cwd(), lifecyclePath)}`)
