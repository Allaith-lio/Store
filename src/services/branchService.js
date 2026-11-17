import { branches, initialStockByProduct } from "../data/branches";
import { products as defaultProducts } from "../data/products";

const PRODUCTS_KEY = "products";
const SELECTED_BRANCH_KEY = "selectedBranch";

function readSavedProducts() {
  try {
    const savedProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
    return Array.isArray(savedProducts) ? savedProducts : [];
  } catch (error) {
    console.error("Failed to read saved products:", error);
    return [];
  }
}

export function buildCatalogProducts() {
  const productsById = new Map(
    defaultProducts.map((product) => [
      product.id,
      {
        ...product,
        stockByBranch: {
          ...(initialStockByProduct[product.id] || {}),
          ...(product.stockByBranch || {}),
        },
      },
    ]),
  );

  readSavedProducts().forEach((product) => {
    if (!product || product.id == null) return;

    const existingProduct = productsById.get(product.id);
    const defaultStock =
      initialStockByProduct[product.id] ||
      Object.fromEntries(branches.map((branch) => [branch.id, 0]));
    const legacyStock =
      product.stockByBranch ||
      (product.stock != null
        ? { main: Number(product.stock), north: 0, south: 0 }
        : defaultStock);

    productsById.set(product.id, {
      ...existingProduct,
      ...product,
      comments: Array.isArray(product.comments) ? product.comments : [],
      highlights: Array.isArray(product.highlights) ? product.highlights : [],
      stockByBranch: { ...defaultStock, ...legacyStock },
    });
  });

  return [...productsById.values()];
}
let cachedRaw;
let cachedCatalog;

export function getCatalogProducts() {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (cachedCatalog && raw === cachedRaw) return cachedCatalog;
  cachedRaw = raw;
  cachedCatalog = buildCatalogProducts();
  return cachedCatalog;
}

export function getProductStock(product, branchId) {
  const stock = product?.stockByBranch?.[branchId];
  if (Number.isFinite(Number(stock))) return Math.max(0, Number(stock));

  const initialStock = initialStockByProduct[product?.id]?.[branchId] ?? 0;
  return Math.max(0, Number(initialStock));
}

export function getSelectedBranchId() {
  const selectedBranchId = localStorage.getItem(SELECTED_BRANCH_KEY);
  return branches.some((branch) => branch.id === selectedBranchId)
    ? selectedBranchId
    : branches[0].id;
}

export function saveSelectedBranchId(branchId) {
  if (!branches.some((branch) => branch.id === branchId)) {
    throw new Error(`Unknown branch: ${branchId}`);
  }

  localStorage.setItem(SELECTED_BRANCH_KEY, branchId);
}
export function isBranchOpen(branch, now = new Date()) {
  const hour = now.getHours();
  return hour >= branch.opensAt && hour < branch.closesAt;
}

export function getStockStatus(stock) {
  if (stock <= 0) return { key: "out", label: "Out of stock" };
  if (stock <= 3) return { key: "low", label: `Only ${stock} left` };
  return { key: "in", label: "In stock" };
}

export function getBranchesWithStock(product, excludeBranchId) {
  return branches.filter(
    (branch) =>
      branch.id !== excludeBranchId && getProductStock(product, branch.id) > 0,
  );
}