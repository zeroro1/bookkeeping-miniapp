"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://120.26.28.23:80/api";
function request(url, method = "GET", data = {}) {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token");
    common_vendor.index.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        "Content-Type": "application/json",
        "Authorization": token ? "Bearer " + token : ""
      },
      success(res) {
        var _a;
        if (res.statusCode === 200) {
          if (res.data && res.data.code === 200) {
            resolve(res.data);
          } else {
            common_vendor.index.showToast({ title: ((_a = res.data) == null ? void 0 : _a.message) || "请求失败", icon: "none" });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.removeStorageSync("userId");
          common_vendor.index.reLaunch({ url: "/pages/login/index" });
          reject({ code: 401, message: "未登录" });
        } else {
          common_vendor.index.showToast({ title: "请求失败", icon: "none" });
          reject({ code: res.statusCode, message: "请求失败" });
        }
      },
      fail(err) {
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
        reject({ code: -1, message: "网络错误" });
      }
    });
  });
}
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
