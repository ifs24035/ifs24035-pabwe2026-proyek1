import { describe, it, expect } from "vitest";
import { ONIONS, PEPPERS, resolveArtKind, resolveArtTheme } from "./productArtHelper";

describe("resolveArtKind", () => {
  it("memilih jenis dari kata di nama produk", () => {
    expect(resolveArtKind("Jahe Merah")).toBe("jahe");
    expect(resolveArtKind("Selendang Ulos")).toBe("selendang");
    expect(resolveArtKind("Andaliman")).toBe("rempah");
  });

  it("memakai kategori, lalu ikon, lalu keranjang sebagai cadangan", () => {
    expect(resolveArtKind("Produk X", "tenun-ulos")).toBe("ulos");
    expect(resolveArtKind("Produk X", "", "🍯")).toBe("madu");
    expect(resolveArtKind("Produk X")).toBe("keranjang");
    expect(resolveArtKind()).toBe("keranjang");
  });
});

describe("resolveArtTheme", () => {
  it("ikan mas berwarna emas, ikan lain berwarna perak", () => {
    expect(resolveArtTheme("ikan", "Ikan Mas Segar").fish[0]).toBe("#fbbf24");
    expect(resolveArtTheme("ikan", "Ikan Pora-Pora").fish[0]).toBe("#e2e8f0");
  });

  it("selalu menyediakan warna kain dan latar, juga untuk jenis tak dikenal", () => {
    expect(resolveArtTheme("ulos").cloth).toHaveLength(3);
    expect(resolveArtTheme("tidak-ada").bg).toEqual(resolveArtTheme("keranjang").bg);
  });
});

describe("data gambar", () => {
  it("butir andaliman membentuk 4 baris gundukan", () => {
    expect(PEPPERS).toHaveLength(9 + 7 + 5 + 3);
  });

  it("ada tiga bawang", () => {
    expect(ONIONS).toHaveLength(3);
  });
});
