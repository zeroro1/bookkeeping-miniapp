"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const logging = common_vendor.ref(false);
    async function handleLogin() {
      logging.value = true;
      try {
        const loginRes = await new Promise((resolve, reject) => {
          common_vendor.index.login({ provider: "weixin", success: resolve, fail: reject });
        });
        await utils_request.request("/auth/login", "POST", { code: loginRes.code });
        common_vendor.index.setStorageSync("token", loginRes.data.token);
        common_vendor.index.setStorageSync("userId", loginRes.data.userId);
        common_vendor.index.setStorageSync("openid", loginRes.data.openid);
        common_vendor.index.reLaunch({ url: "/pages/index/index" });
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/login/index.vue:50", "登录失败", err);
        common_vendor.index.showToast({ title: "登录失败，请重试", icon: "none" });
      } finally {
        logging.value = false;
      }
    }
    async function handleTestLogin() {
      logging.value = true;
      try {
        const res = await utils_request.request("/auth/test-login", "GET");
        common_vendor.index.setStorageSync("token", res.data.token);
        common_vendor.index.setStorageSync("userId", res.data.userId);
        common_vendor.index.setStorageSync("openid", res.data.openid);
        common_vendor.index.reLaunch({ url: "/pages/index/index" });
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/login/index.vue:65", "测试登录失败", err);
        common_vendor.index.showToast({ title: "登录失败，请重试", icon: "none" });
      } finally {
        logging.value = false;
      }
    }
    return (_ctx, _cache) => {
      return {
        a: logging.value,
        b: common_vendor.o(handleLogin, "bd"),
        c: logging.value,
        d: common_vendor.o(handleTestLogin, "46")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d08ef7d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/index.js.map
