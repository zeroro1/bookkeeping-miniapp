"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "AccountForm",
  props: {
    formData: { type: Object, required: true },
    categories: { type: Array, default: () => [] },
    categoryIndex: { type: Number, default: -1 },
    showCategory: { type: Boolean, default: true }
  },
  emits: ["selectType", "amountInput", "dateChange", "categoryChange", "fromAccountInput", "toAccountInput", "remarkInput"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const typeOptions = [
      { value: 1, label: "收入", icon: "▲", cls: "income" },
      { value: 2, label: "支出", icon: "▼", cls: "expense" },
      { value: 3, label: "转账", icon: "⇄", cls: "transfer" }
    ];
    function selectType(type) {
      emit("selectType", type);
    }
    function onAmountInput(e) {
      emit("amountInput", e);
    }
    function onDateChange(e) {
      emit("dateChange", e);
    }
    function onCategoryChange(e) {
      emit("categoryChange", e);
    }
    function onFromAccountInput(e) {
      emit("fromAccountInput", e);
    }
    function onToAccountInput(e) {
      emit("toAccountInput", e);
    }
    function onRemarkInput(e) {
      emit("remarkInput", e);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(typeOptions, (type, i, i0) => {
          return {
            a: common_vendor.t(type.icon),
            b: common_vendor.n(type.cls),
            c: common_vendor.n({
              active: __props.formData.type === type.value
            }),
            d: common_vendor.t(type.label),
            e: i,
            f: __props.formData.type === type.value ? 1 : "",
            g: common_vendor.o(($event) => selectType(type.value), i)
          };
        }),
        b: __props.formData.amount,
        c: common_vendor.o(onAmountInput, "10"),
        d: common_vendor.t(__props.formData.date || "选择日期"),
        e: __props.formData.date,
        f: common_vendor.o(onDateChange, "84"),
        g: __props.showCategory
      }, __props.showCategory ? {
        h: common_vendor.t(__props.formData.category || "选择分类"),
        i: __props.categories,
        j: __props.categoryIndex,
        k: common_vendor.o(onCategoryChange, "68")
      } : {}, {
        l: __props.formData.type === 3
      }, __props.formData.type === 3 ? {
        m: __props.formData.fromAccount,
        n: common_vendor.o(onFromAccountInput, "d9"),
        o: __props.formData.toAccount,
        p: common_vendor.o(onToAccountInput, "6c")
      } : {}, {
        q: __props.formData.remark,
        r: common_vendor.o(onRemarkInput, "6e")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-aa7ba406"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/AccountForm.js.map
