"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/login/index.js";
  "./pages/index/index.js";
  "./pages/add/index.js";
  "./pages/detail/index.js";
}
const _sfc_main = {
  onLaunch() {
    common_vendor.index.__f__("log", "at App.vue:12", "App Launch");
    const token = common_vendor.index.getStorageSync("token");
    const userId = common_vendor.index.getStorageSync("userId");
    if (!token || !userId) {
      common_vendor.index.reLaunch({ url: "/pages/login/index" });
    }
  }
};
if (!Array) {
  const _component_router_view = common_vendor.resolveComponent("router-view");
  const _component_template = common_vendor.resolveComponent("template");
  (_component_router_view + _component_template)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return { app };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
