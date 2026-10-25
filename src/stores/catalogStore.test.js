import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("../api/catalogApi", () => ({ catalogApi: { categories: vi.fn() } }));

import { catalogApi } from "../api/catalogApi";
import { useCatalogStore } from "./catalogStore";

describe("catalogStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setActivePinia(createPinia());
    catalogApi.categories.mockResolvedValue([{ id: 1, slug: "kopi-rempah" }]);
  });

  it("memuat kategori sekali lalu memakai cache, kecuali dipaksa", async () => {
    const store = useCatalogStore();
    await store.loadCategories();
    await store.loadCategories();
    expect(catalogApi.categories).toHaveBeenCalledTimes(1);
    await store.loadCategories(true);
    expect(catalogApi.categories).toHaveBeenCalledTimes(2);
    expect(store.categories).toHaveLength(1);
  });
});