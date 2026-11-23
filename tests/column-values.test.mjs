import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { transformWithOxc } from "vite";

const modules = {
  inventory: new URL("../src/components/bodyComponents/inventory/Products.jsx", import.meta.url).href,
  product: new URL("../src/components/bodyComponents/inventory/Product.jsx", import.meta.url).href,
  products: new URL("../src/components/bodyComponents/inventory/productList.js", import.meta.url).href,
  columns: new URL("../src/components/bodyComponents/order/orderColumns.jsx", import.meta.url).href,
  orders: new URL("../src/components/bodyComponents/order/listOrders.js", import.meta.url).href,
};

// Transform only these application modules in memory; do not load Vite config or start a server.
const sources = new Map(await Promise.all(Object.values(modules).map(async (url) => {
  const source = await readFile(new URL(url), "utf8");
  if (!url.endsWith(".jsx")) return [url, source];
  const { code } = await transformWithOxc(source, fileURLToPath(url), {
    jsx: { runtime: "automatic" },
    tsconfig: false,
  });
  return [url, code];
})));

// Real React creates the element tree; UI placeholders avoid requiring a browser or MUI internals.
const uiModule = "data:text/javascript," + encodeURIComponent(`
  export const Avatar = "test-avatar";
  export const Button = "test-button";
  export const Typography = "test-typography";
  export const DataGrid = "test-data-grid";
`);

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (sources.has(context.parentURL)) {
      if (specifier === "@mui/material" || specifier === "@mui/x-data-grid") {
        return { url: uiModule, shortCircuit: true };
      }
      if (specifier.startsWith(".")) {
        const relative = new URL(specifier, context.parentURL).href;
        for (const extension of ["", ".js", ".jsx"]) {
          if (sources.has(relative + extension)) {
            return { url: relative + extension, shortCircuit: true };
          }
        }
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (sources.has(url)) {
      return { format: "module", source: sources.get(url), shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});

let Products;
let createOrderColumns;
let productList;
let orders;
try {
  ({ default: Products } = await import(modules.inventory));
  ({ createOrderColumns } = await import(modules.columns));
  ({ default: productList } = await import(modules.products));
  ({ default: orders } = await import(modules.orders));
} finally {
  hooks.deregister();
}

const grid = Products().props.children;
assert.equal(grid.type, "test-data-grid");
const priceGetter = grid.props.columns.find((column) => column.field === "price").valueGetter;
const totalGetter = createOrderColumns(() => {}).find((column) => column.field === "total").valueGetter;

for (const [id, expected] of [[1, "$828"], [2, "$144"], [3, "$28"]]) {
  test(`Inventory product ${id} displays its stored price`, () => {
    const row = productList.find((product) => product.id === id);
    assert.equal(priceGetter({ row }), expected);
  });
}

test("Inventory Price does not change when stock alone changes", () => {
  const product = productList.find((row) => row.id === 1);
  assert.equal(priceGetter({ row: { ...product, stock: 0 } }), "$828");
  assert.equal(priceGetter({ row: { ...product, stock: 999 } }), "$828");
});

for (const [id, expected] of [[1, 5000], [2, 1580], [3, 1000]]) {
  test(`Order ${id} calculates its sample subtotal`, () => {
    const row = orders.find((order) => order.id === id);
    assert.equal(totalGetter({ row }), expected);
  });
}

test("An empty products array has a numeric subtotal of zero", () => {
  assert.equal(totalGetter({ row: { products: [] } }), 0);
});

test("A quantity of two at a unit price of 12.5 has a subtotal of 25", () => {
  const row = { products: [{ quantity: 2, product: { price: 12.5 } }] };
  assert.equal(totalGetter({ row }), 25);
});

test("Duplicate product lines contribute separately", () => {
  const product = { id: 1, price: 12.5 };
  const row = {
    products: [{ quantity: 2, product }, { quantity: 3, product }],
  };
  assert.equal(totalGetter({ row }), 62.5);
});

test("Calculating a subtotal does not mutate the order or nested products", () => {
  const row = {
    id: 99,
    products: [{ quantity: 2, product: { id: 1, price: 12.5 } }],
  };
  const before = structuredClone(row);
  Object.freeze(row.products[0].product);
  Object.freeze(row.products[0]);
  Object.freeze(row.products);
  Object.freeze(row);

  assert.equal(totalGetter({ row }), 25);
  assert.deepEqual(row, before);
});
