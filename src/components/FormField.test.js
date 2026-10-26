import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FormField from "./FormField.vue";

// Pasangan props agar v-model berfungsi pada wrapper
function withModel(options) {
  const wrapper = mount(FormField, {
    ...options,
    props: {
      ...options.props,
      "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }),
    },
  });
  return wrapper;
}

describe("FormField", () => {
  it("menghubungkan label dengan input dan meneruskan atribut ke input", () => {
    const w = mount(FormField, {
      props: { label: "Email", id: "email-x" },
      attrs: { type: "email", required: "", placeholder: "a@b.c", "data-testid": "kolom" },
    });
    const input = w.find("input");
    expect(w.find("label").attributes("for")).toBe("email-x");
    expect(input.attributes("id")).toBe("email-x");
    expect(input.attributes("type")).toBe("email");
    expect(input.attributes("data-testid")).toBe("kolom");
    expect(w.find("label").text()).toBe("Email");
  });

  it("membuat id otomatis bila tidak diberikan", () => {
    const w = mount(FormField, { props: { label: "Nama" } });
    const id = w.find("input").attributes("id");
    expect(id).toBeTruthy();
    expect(w.find("label").attributes("for")).toBe(id);
  });

  it("v-model memperbarui nilai saat pengguna mengetik", async () => {
    const w = withModel({ props: { label: "Nama", modelValue: "" } });
    await w.find("input").setValue("Budi");
    expect(w.props("modelValue")).toBe("Budi");
  });

  it("v-model.number mengubah angka menjadi number, selain itu dibiarkan", async () => {
    const w = withModel({ props: { label: "Harga", modelValue: 0, modelModifiers: { number: true } } });
    await w.find("input").setValue("5000");
    expect(w.props("modelValue")).toBe(5000);
    await w.find("input").setValue("abc");
    expect(w.props("modelValue")).toBe("abc");
    await w.find("input").setValue("");
    expect(w.props("modelValue")).toBe("");
  });

  it("mendukung textarea", async () => {
    const w = withModel({ props: { label: "Alamat", as: "textarea", modelValue: "" }, attrs: { rows: "3" } });
    expect(w.find("textarea").exists()).toBe(true);
    expect(w.find("input").exists()).toBe(false);
    await w.find("textarea").setValue("Jl. Toba");
    expect(w.props("modelValue")).toBe("Jl. Toba");
  });

  it("mendukung select dengan pilihan dari slot", async () => {
    const w = withModel({
      props: { label: "Kategori", as: "select", modelValue: "" },
      slots: { default: '<option value="1">Kopi</option><option value="2">Ikan</option>' },
    });
    expect(w.findAll("option")).toHaveLength(2);
    await w.find("select").setValue("2");
    expect(w.props("modelValue")).toBe("2");
  });

  it("memberi ruang ekstra bila ada ikon", () => {
    const plain = mount(FormField, { props: { label: "A" } });
    const withIcon = mount(FormField, { props: { label: "B" }, slots: { icon: '<i class="ikon" />' } });
    expect(plain.find("input").classes()).toContain("px-3.5");
    expect(withIcon.find(".ikon").exists()).toBe(true);
    expect(withIcon.find("input").classes()).toContain("pl-10");
  });
});
