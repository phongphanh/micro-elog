(function () {
  var ELOG_APP_CODE = "elog";
  var ELOG_DEFAULT_PUBLIC_ORIGIN = "https://micro-elog.pages.dev";
  var ELOG_HOST_BASEPATH = "/apps/elog";
  var ELOG_FRAME_ID = "elog-qiankun-frame";
  var ELOG_NAV_ITEMS = [
    { key: "elog-dashboard", label: "Dashboard", path: "/apps/elog", icon: "D" },
    { key: "elog-bookings", label: "Bookings", path: "/apps/elog/bookings", icon: "B" },
    { key: "elog-shipments", label: "Shipments", path: "/apps/elog/shipments", icon: "S" },
    { key: "elog-containers", label: "Containers", path: "/apps/elog/containers", icon: "C" },
    { key: "elog-appointments", label: "Truck Appointments", path: "/apps/elog/appointments", icon: "T" },
    { key: "elog-vehicles", label: "Vehicles", path: "/apps/elog/vehicles", icon: "V" },
    { key: "elog-drivers", label: "Drivers", path: "/apps/elog/drivers", icon: "D" },
    { key: "elog-documents", label: "Documents", path: "/apps/elog/documents", icon: "D" },
    { key: "elog-invoices", label: "Invoices", path: "/apps/elog/invoices", icon: "I" },
    { key: "elog-payments", label: "Payments", path: "/apps/elog/payments", icon: "P" },
    { key: "elog-customers", label: "Customers", path: "/apps/elog/customers", icon: "C" },
    { key: "elog-partners", label: "Partners", path: "/apps/elog/partners", icon: "P" },
    { key: "elog-reports", label: "Reports", path: "/apps/elog/reports", icon: "R" },
    { key: "elog-notifications", label: "Notifications", path: "/apps/elog/notifications", icon: "N" },
    { key: "elog-users", label: "Users", path: "/apps/elog/users", icon: "U" },
    { key: "elog-roles", label: "Roles", path: "/apps/elog/roles", icon: "R" },
    { key: "elog-master-data", label: "Master Data", path: "/apps/elog/master-data", icon: "M" },
    { key: "elog-settings", label: "Settings", path: "/apps/elog/settings", icon: "S" }
  ];

  function normalizeProps(props) {
    props = props || {};

    return {
      appCode: "elog",
      layoutContext: props.layoutContext,
      shellBridge: props.shellBridge,
      userContext: props.userContext,
      token: props.token,
      correlationId: props.correlationId,
      returnUrl: props.returnUrl
    };
  }

  function publishIntegrationContext(props) {
    window.__ELOG_INTEGRATION_CONTEXT__ = normalizeProps(props);
    window.dispatchEvent(new CustomEvent("elog:integration-context"));
  }

  function getContainerElement(container) {
    if (!container) {
      return document.querySelector("#subapp-container") || document.body;
    }

    if (container.nodeType === 11 && container.querySelector) {
      return container.querySelector("#subapp-container") || container.firstElementChild || container;
    }

    return container;
  }

  function getPublicOrigin(props) {
    if (props && props.assetBaseUrl) {
      return String(props.assetBaseUrl).replace(/\/$/, "");
    }

    if (window.__ELOG_PUBLIC_ORIGIN__) {
      return String(window.__ELOG_PUBLIC_ORIGIN__).replace(/\/$/, "");
    }

    if (window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__) {
      return new URL(window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__).origin;
    }

    return ELOG_DEFAULT_PUBLIC_ORIGIN;
  }

  function getShellPath() {
    var pathname = window.location.pathname || ELOG_HOST_BASEPATH;

    if (pathname === ELOG_HOST_BASEPATH || pathname.indexOf(ELOG_HOST_BASEPATH + "/") === 0) {
      return pathname;
    }

    return ELOG_HOST_BASEPATH;
  }

  function getFrameUrl(props) {
    var url = new URL(getShellPath(), getPublicOrigin(props));

    url.searchParams.set("__qiankun", "1");

    return url.toString();
  }

  function renderFrame(props) {
    var container = getContainerElement(props.container);
    var frame = document.createElement("iframe");

    container.innerHTML = "";
    frame.id = ELOG_FRAME_ID;
    frame.title = "eLog";
    frame.src = getFrameUrl(props);
    frame.setAttribute("data-elog-qiankun-frame", "true");
    frame.style.width = "100%";
    frame.style.minHeight = "calc(100vh - 220px)";
    frame.style.height = "100%";
    frame.style.border = "0";
    frame.style.display = "block";
    frame.style.background = "transparent";
    container.appendChild(frame);

    return frame;
  }

  async function bootstrap() {
    console.info("[eLog] bootstrap");
  }

  async function mount(props) {
    props = props || {};
    publishIntegrationContext(props);
    if (props.shellBridge && props.shellBridge.setNavItems) {
      props.shellBridge.setNavItems(ELOG_APP_CODE, ELOG_NAV_ITEMS);
    }

    if (props.container && props.container.setAttribute) {
      props.container.setAttribute("data-elog-mounted", "true");
    }

    renderFrame(props);

    console.info("[eLog] mounted", {
      appCode: ELOG_APP_CODE,
      correlationId: props.correlationId,
      sidebarMode: props.layoutContext && props.layoutContext.sidebarMode,
      userId: props.userContext && props.userContext.userId,
      orgId: props.userContext && props.userContext.orgId,
      frameUrl: getFrameUrl(props)
    });
  }

  async function unmount(props) {
    props = props || {};
    if (props.shellBridge && props.shellBridge.clearNavItems) {
      props.shellBridge.clearNavItems(ELOG_APP_CODE);
    }
    window.__ELOG_INTEGRATION_CONTEXT__ = {};
    window.dispatchEvent(new CustomEvent("elog:integration-context"));

    getContainerElement(props.container).innerHTML = "";

    console.info("[eLog] unmounted");
  }

  var lifeCycles = {
    bootstrap: bootstrap,
    mount: mount,
    unmount: unmount
  };

  window.bootstrap = bootstrap;
  window.mount = mount;
  window.unmount = unmount;
  window.elogApp = lifeCycles;
})();
