(function () {
  var ELOG_APP_CODE = "elog";
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

    console.info("[eLog] mounted", {
      appCode: ELOG_APP_CODE,
      correlationId: props.correlationId,
      sidebarMode: props.layoutContext && props.layoutContext.sidebarMode,
      userId: props.userContext && props.userContext.userId,
      orgId: props.userContext && props.userContext.orgId
    });
  }

  async function unmount(props) {
    props = props || {};
    if (props.shellBridge && props.shellBridge.clearNavItems) {
      props.shellBridge.clearNavItems(ELOG_APP_CODE);
    }
    window.__ELOG_INTEGRATION_CONTEXT__ = {};
    window.dispatchEvent(new CustomEvent("elog:integration-context"));

    if (props.container) {
      props.container.innerHTML = "";
    }

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
