"use client";

export type PageBatch<T> = {
  items: T[];
  hasNext: boolean;
};

/** Load every server page while preserving the API's page contract. */
export async function fetchAllPages<T>(
  loadPage: (page: number, pageSize: number) => Promise<PageBatch<T>>,
  pageSize = 100,
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  while (true) {
    const result = await loadPage(page, pageSize);
    items.push(...result.items);
    if (!result.hasNext || result.items.length === 0) return items;
    page += 1;
  }
}
