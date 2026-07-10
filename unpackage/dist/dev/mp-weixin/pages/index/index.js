"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
if (!Math) {
  MonthPicker();
}
const MonthPicker = () => "../../components/MonthPicker.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const accounts = common_vendor.ref([]);
    const currentMonth = common_vendor.ref(common_vendor.dayjs().format("YYYY-MM"));
    const activeType = common_vendor.ref(0);
    const tabs = common_vendor.ref(["全部", "收入", "支出", "转账"]);
    const monthIncome = common_vendor.ref("0.00");
    const monthExpense = common_vendor.ref("0.00");
    const balance = common_vendor.ref("0.00");
    function getCategoryName(item) {
      if (item.type === 3)
        return "转账";
      return item.category || "未分类";
    }
    function getCategoryIcon(item) {
      if (item.type === 1)
        return "▲";
      if (item.type === 2)
        return "▼";
      return "⇄";
    }
    function typeClass(item) {
      if (item.type === 1)
        return "type-income";
      if (item.type === 2)
        return "type-expense";
      return "type-transfer";
    }
    function amountText(item) {
      if (item.type === 1)
        return "+ " + item.amount;
      if (item.type === 2)
        return "- " + item.amount;
      return item.amount;
    }
    const balanceClass = common_vendor.computed(() => {
      const b = parseFloat(balance.value);
      if (b > 0)
        return "text-success";
      if (b < 0)
        return "text-danger";
      return "";
    });
    async function loadAccounts() {
      const userId = common_vendor.index.getStorageSync("userId");
      if (!userId)
        return;
      try {
        const params = { month: currentMonth.value };
        if (activeType.value > 0)
          params.type = activeType.value;
        const res = await utils_request.request("/account/list", "GET", params);
        const list = res.data || [];
        let inc = 0, exp = 0;
        list.forEach((a) => {
          if (a.type === 1)
            inc += parseFloat(a.amount);
          if (a.type === 2)
            exp += parseFloat(a.amount);
        });
        monthIncome.value = inc.toFixed(2);
        monthExpense.value = exp.toFixed(2);
        balance.value = (inc - exp).toFixed(2);
        accounts.value = list;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:132", "加载失败", err);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      }
    }
    function onMonthChange(month) {
      currentMonth.value = month;
      loadAccounts();
    }
    function filterType(index) {
      activeType.value = index;
      loadAccounts();
    }
    function goDetail(item) {
      common_vendor.index.navigateTo({ url: "/pages/detail/index?id=" + item.id });
    }
    function goAdd() {
      common_vendor.index.navigateTo({ url: "/pages/add/index" });
    }
    common_vendor.onMounted(() => {
      loadAccounts();
    });
    common_vendor.onShow(() => {
      loadAccounts();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(onMonthChange, "e5"),
        b: common_vendor.o(($event) => currentMonth.value = $event, "91"),
        c: common_vendor.p({
          modelValue: currentMonth.value
        }),
        d: common_vendor.t(monthIncome.value),
        e: common_vendor.t(monthExpense.value),
        f: common_vendor.t(balance.value),
        g: common_vendor.n(balanceClass.value),
        h: common_vendor.f(tabs.value, (tab, i, i0) => {
          return {
            a: common_vendor.t(tab),
            b: i,
            c: activeType.value === i ? 1 : "",
            d: common_vendor.o(($event) => filterType(i), i)
          };
        }),
        i: common_vendor.f(accounts.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getCategoryIcon(item)),
            b: common_vendor.n(typeClass(item)),
            c: common_vendor.t(getCategoryName(item)),
            d: common_vendor.t(amountText(item)),
            e: common_vendor.n(typeClass(item)),
            f: item.remark
          }, item.remark ? {
            g: common_vendor.t(item.remark)
          } : {}, {
            h: item.fromAccount || item.toAccount
          }, item.fromAccount || item.toAccount ? {
            i: common_vendor.t(item.fromAccount || ""),
            j: common_vendor.t(item.toAccount || "")
          } : {}, {
            k: common_vendor.t(item.date),
            l: item.id,
            m: common_vendor.o(($event) => goDetail(item), item.id)
          });
        }),
        j: accounts.value.length === 0
      }, accounts.value.length === 0 ? {} : {}, {
        k: common_vendor.o(goAdd, "f5")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
