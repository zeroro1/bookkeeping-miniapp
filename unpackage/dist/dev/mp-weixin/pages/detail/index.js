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
    const isEdit = common_vendor.ref(false);
    const editId = common_vendor.ref(null);
    const formData = common_vendor.reactive({ type: null, amount: "", date: "", category: "", fromAccount: "", toAccount: "", remark: "" });
    const categories = common_vendor.ref([]);
    const categoryIndex = common_vendor.ref(-1);
    const showCategory = common_vendor.computed(() => formData.type !== 3);
    const canSubmit = common_vendor.computed(() => formData.type && formData.amount && parseFloat(formData.amount) > 0);
    common_vendor.onMounted(async () => {
      const pages = getCurrentPages();
      const query = pages[pages.length - 1].options;
      if (query.id) {
        isEdit.value = true;
        editId.value = query.id;
        await loadAccountDetail(query.id);
      }
    });
    async function loadAccountDetail(id) {
      common_vendor.index.showLoading({ title: "加载中..." });
      try {
        const res = await utils_request.request("/account/" + id, "GET");
        const item = res.data;
        Object.assign(formData, { type: item.type, amount: String(item.amount), date: item.date, category: item.category, fromAccount: item.fromAccount, toAccount: item.toAccount, remark: item.remark });
        updateCategories(item.type);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/detail/index.vue:43", "加载失败", err);
      } finally {
        common_vendor.index.hideLoading();
      }
    }
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
      const data = { type: formData.type, amount: parseFloat(formData.amount), date: formData.date, category: formData.category, fromAccount: formData.fromAccount, toAccount: formData.toAccount, remark: formData.remark };
      common_vendor.index.showLoading({ title: "保存中..." });
      try {
        await utils_request.request("/account/" + editId.value, "PUT", data);
        common_vendor.index.showToast({ title: "保存成功" });
        setTimeout(() => common_vendor.index.navigateBack(), 1500);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/detail/index.vue:65", "提交失败", err);
      } finally {
        common_vendor.index.hideLoading();
      }
    }
    function handleDelete() {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这条账目吗？",
        success: async (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "删除中..." });
            try {
              await utils_request.request("/account/" + editId.value, "DELETE");
              common_vendor.index.showToast({ title: "删除成功" });
              setTimeout(() => common_vendor.index.navigateBack(), 1500);
            } catch (err) {
              common_vendor.index.__f__("error", "at pages/detail/index.vue:75", "删除失败", err);
            } finally {
              common_vendor.index.hideLoading();
            }
          }
        }
      });
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
        i: common_vendor.o(handleDelete, "c5"),
        j: !canSubmit.value ? 1 : "",
        k: common_vendor.o(handleSubmit, "36")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2fd5b0a7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/index.js.map
