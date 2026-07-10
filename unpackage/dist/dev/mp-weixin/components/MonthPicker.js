"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "MonthPicker",
  props: {
    modelValue: { type: String, default: "" }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const panelOpen = common_vendor.ref(false);
    const now = /* @__PURE__ */ new Date();
    const selYear = common_vendor.ref(now.getFullYear());
    const selMonth = common_vendor.ref(now.getMonth() + 1);
    const currentText = common_vendor.computed(() => selYear.value + "年" + String(selMonth.value).padStart(2, "0") + "月");
    const monthList = common_vendor.computed(() => {
      const items = [];
      for (let i = 1; i <= 12; i++) {
        items.push({ val: i, label: String(i).padStart(2, "0") + "月" });
      }
      return items;
    });
    function togglePanel() {
      panelOpen.value = !panelOpen.value;
    }
    function closePanel() {
      panelOpen.value = false;
    }
    function prevMonth() {
      if (selMonth.value === 1) {
        selMonth.value = 12;
        selYear.value--;
      } else {
        selMonth.value--;
      }
      sync();
    }
    function nextMonth() {
      if (selMonth.value === 12) {
        selMonth.value = 1;
        selYear.value++;
      } else {
        selMonth.value++;
      }
      sync();
    }
    function prevYear() {
      selYear.value--;
      sync();
    }
    function nextYear() {
      selYear.value++;
      sync();
    }
    function selectMonth(m) {
      selMonth.value = m;
      panelOpen.value = false;
      sync();
    }
    function sync() {
      const v = selYear.value + "-" + String(selMonth.value).padStart(2, "0");
      emit("update:modelValue", v);
      emit("change", v);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(prevMonth, "1e"),
        b: common_vendor.t(currentText.value),
        c: common_vendor.t(panelOpen.value ? "▲" : "▼"),
        d: common_vendor.o(nextMonth, "5f"),
        e: common_vendor.o(togglePanel, "b2"),
        f: panelOpen.value
      }, panelOpen.value ? {
        g: common_vendor.o(prevYear, "a9"),
        h: common_vendor.t(selYear.value),
        i: common_vendor.o(nextYear, "02"),
        j: common_vendor.f(monthList.value, (m, k0, i0) => {
          return {
            a: common_vendor.t(m.label),
            b: m.val,
            c: m.val === selMonth.value ? 1 : "",
            d: common_vendor.o(($event) => selectMonth(m.val), m.val)
          };
        }),
        k: common_vendor.o(() => {
        }, "36")
      } : {}, {
        l: panelOpen.value
      }, panelOpen.value ? {
        m: common_vendor.o(closePanel, "63")
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7bedd8d5"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/MonthPicker.js.map
