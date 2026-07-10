"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const utils_constant = require("../../utils/constant.js");
if (!Math) {
  AccountForm();
}
const AccountForm = () => "../../components/AccountForm.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const formData = common_vendor.reactive({ type: null, amount: "", date: "", category: "", fromAccount: "", toAccount: "", remark: "" });
    const categories = common_vendor.ref([]);
    const categoryIndex = common_vendor.ref(-1);
    const showCategory = common_vendor.computed(() => formData.type !== 3);
    const canSubmit = common_vendor.computed(() => formData.type && formData.amount && parseFloat(formData.amount) > 0);
    const today = /* @__PURE__ */ new Date();
    formData.date = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
    function selectType(type) {
      formData.type = type;
      updateCategories(type);
    }
    function updateCategories(type) {
      if (type === 1)
        categories.value = utils_constant.INCOME_CATEGORIES;
      else if (type === 2)
        categories.value = utils_constant.EXPENSE_CATEGORIES;
      else
        categories.value = [];
      categoryIndex.value = -1;
      formData.category = "";
    }
    function onAmountInput(e) {
      formData.amount = e.detail.value;
    }
    function onDateChange(e) {
      formData.date = e.detail.value;
    }
    function onCategoryChange(e) {
      const idx = parseInt(e.detail.value);
      categoryIndex.value = idx;
      formData.category = categories.value[idx] || "";
    }
    function onFromAccountInput(e) {
      formData.fromAccount = e.detail.value;
    }
    function onToAccountInput(e) {
      formData.toAccount = e.detail.value;
    }
    function onRemarkInput(e) {
      formData.remark = e.detail.value;
    }
    async function handleSubmit() {
      if (!formData.type)
        return common_vendor.index.showToast({ title: "请选择类型", icon: "none" });
      if (!canSubmit.value)
        return common_vendor.index.showToast({ title: "请输入有效金额", icon: "none" });
      const userId = common_vendor.index.getStorageSync("userId");
      if (!userId)
        return common_vendor.index.showToast({ title: "请先登录", icon: "none" });
      const data = { type: formData.type, amount: parseFloat(formData.amount), date: formData.date, category: formData.category, fromAccount: formData.fromAccount, toAccount: formData.toAccount, remark: formData.remark };
      common_vendor.index.showLoading({ title: "添加中..." });
      try {
        await utils_request.request("/account", "POST", data);
        common_vendor.index.showToast({ title: "添加成功" });
        setTimeout(() => common_vendor.index.navigateBack(), 1500);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/add/index.vue:51", "提交失败", err);
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(selectType, "b5"),
        b: common_vendor.o(onAmountInput, "5b"),
        c: common_vendor.o(onDateChange, "db"),
        d: common_vendor.o(onCategoryChange, "fa"),
        e: common_vendor.o(onFromAccountInput, "9d"),
        f: common_vendor.o(onToAccountInput, "9d"),
        g: common_vendor.o(onRemarkInput, "ed"),
        h: common_vendor.p({
          formData,
          categories: categories.value,
          categoryIndex: categoryIndex.value,
          showCategory: showCategory.value
        }),
        i: common_vendor.o(handleSubmit, "5e")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-89f6901d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/add/index.js.map
